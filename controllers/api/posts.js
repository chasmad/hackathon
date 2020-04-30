const Post = require('../../models/post');
const Classroom = require('../../models/classroom');

module.exports = {
    index,
    show,
    create,
    update,
    delete: deleteOne
}

async function index(req, res) {
    const posts = await Post.find({ classroom: req.user.classroom });
    res.status(200).json(posts);
}

async function show(req, res) {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
}

async function create(req, res) {
    req.body.user = req.user;
    req.body.classroom = req.user.classroom;
    req.body.owner = req.user.name;
    const post = await Post.create(req.body);
    res.status(201).json(post);
}

async function update(req, res) {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPost);
}

async function deleteOne(req, res) {
    const deletedPost = await Post.findByIdAndRemove(req.params.id);
    res.status(200).json(deletedPost);
}