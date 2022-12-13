import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

// getting all posts from database and sending response to front end;
export const getPosts = async (req, res) => {
    try {
        // getting all posts from DB;
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// creating all new posts here in this controller function;
export const createPosts =  async (req, res) => {
    //saving all info from front end request body in post variable
    const post = req.body;

    //creating a new object with date aswell;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        //saving the newly created object in DB;
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// updating the post in this function;
export const updatePost = async (req, res) => {
    //getting the id from req parameter;
    const { id: _id }= req.params;

    //getting post from request body;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    //updating the post in DB by given id;
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndDelete(_id);

    res.json({message: 'Post got deleted'});
}

export const likePost = async (req, res) => {
    // saving id as _id from request parameter from front end;
    const { id: _id } = req.params;

    // checking req.userid found it is given by middleware auth.js where we store the current user id to req.userId. It is authorization process;
    if (!req.userId) return res.json({message: 'Unauthenticated'});

    // checks whether the id is valid or not
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    // will find the post with given id;
    const post = await PostMessage.findById(_id);

    // finding the index of current post likes array where we store the ids of people who like the post will return -1 if nothing found;
    const index = post.likes.findIndex((id) => id === String(req.userId));
    // console.log(index);

    if (index === -1) {

        //index -1 means person has not liked the post yet so here pushing his id to likes array;
        post.likes.push(req.userId);
    }else {

        //index is something means person has already liked the post and again hit the like button in this case his like will be removed by removing his id from likes array;
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    // here we update the array and giving the brand new post object;
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatedPost);
}