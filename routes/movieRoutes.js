const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

// GET all movies
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET one movie
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json(movie);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// ADD movie
router.post("/", async (req, res) => {
    try {
        const movie = new Movie({
            title: req.body.title,
            genre: req.body.genre,
            year: req.body.year,
            rating: req.body.rating,
            description: req.body.description
        });

        const savedMovie = await movie.save();

        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE movie
router.put("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json(movie);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// DELETE movie
router.delete("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json({
            message: "Movie deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;