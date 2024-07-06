import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Endpoint to get the latest 10 reviews
app.get("/reviews/latest", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { created_at: "desc" },
      take: 10,
      include: { user: true, manga: true },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest reviews" });
  }
});

// Endpoint to get reviews by a specific user
app.get("/reviews/user/:auth0Id", requireAuth, async (req, res) => {
  const { auth0Id } = req.params;
  try {
    console.log(`Fetching reviews for user: ${auth0Id}`);
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { user_id: user.id },
      include: { user: true, manga: true },
    });
    res.json(reviews);
  } catch (error) {
    console.error(`Failed to fetch reviews for user ${auth0Id}:`, error);
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
});


// Endpoint to fetch a single manga by ID
app.get('/manga/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const manga = await prisma.manga.findUnique({
      where: { id: Number(id) },
    });
    res.json(manga);
  } catch (error) {
    console.error(`Failed to fetch manga with id ${id}:`, error);
    res.status(500).json({ error: `Failed to fetch manga with id ${id}` });
  }
});

// Endpoint to fetch reviews for a single manga by manga ID
app.get('/manga/:id/reviews', async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { manga_id: Number(id) },
      include: { user: true },
    });
    res.json(reviews);
  } catch (error) {
    console.error(`Failed to fetch reviews for manga with id ${id}:`, error);
    res.status(500).json({ error: `Failed to fetch reviews for manga with id ${id}` });
  }
});

// Endpoint to get all manga with their cover images
app.get("/manga", async (req, res) => {
  try {
    const mangaList = await prisma.manga.findMany();
    res.json(mangaList);
  } catch (error) {
    console.error("Failed to fetch mangas:", error);
    res.status(500).json({ error: "Failed to fetch mangas" });
  }
});

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
// Verify user endpoint
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload.email || req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload.name || req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  console.log('Token Payload:', req.auth.payload);
  console.log('Extracted email:', email);
  console.log('Extracted name:', name);
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (user) {
      res.json(user);
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          auth0Id,
          name,
          picture: ''
        },
      });

      res.json(newUser);
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to post a new review
app.post("/reviews", requireAuth, async (req, res) => {
  const { manga_id, rating, comment } = req.body;
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newReview = await prisma.review.create({
      data: {
        manga_id: Number(manga_id),
        user_id: user.id,
        rating: Number(rating),
        comment,
      },
      include: {
        manga: true,  // Include manga data in the response
      },
    });

    res.json(newReview);
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// Endpoint to delete a review by ID
app.delete("/reviews/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const review = await prisma.review.delete({
      where: { id: Number(id) },
    });
    res.json({ success: true, review });
  } catch (error) {
    console.error(`Failed to delete review ${id}:`, error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});



// Endpoint to update user profile
app.put("/profile", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { picture } = req.body;
  console.log(`Updating profile for user: ${auth0Id}, with picture: ${picture}`);

  try {
    const user = await prisma.user.update({
      where: { auth0Id },
      data: { picture },
    });
    console.log(`Profile updated successfully for user: ${auth0Id}`);
    res.json(user);
  } catch (error) {
    console.error("Failed to update profile", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Endpoint to fetch user profile
app.get("/profile", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  console.log(`Fetching profile for user: ${auth0Id}`);

  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      console.log(`User not found: ${auth0Id}`);
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`Profile fetched successfully for user: ${auth0Id}`, user);
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});


// app.listen(8000, () => {
//   console.log("Server running on http://localhost:8000 🎉 🚀");
// });

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
