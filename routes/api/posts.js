const express = require('express')
const router = express.Router();
const {check, validationResult} = require('express-validator/check')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')


// route POST api/posts
// desc create a post
// access private
// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [
  auth,
  [
    check('text', 'Text is required.').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select('-password')
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error.' }] });
  }
});
// route GET api/posts
// desc retrieve posts
// access private
router.get('/', auth, async (req,res) => {
  try {
    const posts = await Post.find().sort({date:-1})
    res.json(posts)
  }catch(err){
    console.error(err.message)
    res.status(500).send('server Error')
  }
})
// route GET api/posts/:id
// desc retrieve post by id
// access private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ errors: [{ msg: 'Post not found.' }] });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Post not found.' }] });
    }
    res.status(500).json({ errors: [{ msg: 'Server error.' }] });
  }
});

// route GET api/posts
// desc retrieve posts
// access private
router.delete('/:id', auth, async (req,res) => {
  try {
    const post = await Post.findOne({_id:req.params.id})
    if (!post) {
      res.status(401).json({msg:'post cannot be deleted'})
    }
    if (req.user.id !== post.user.toString()) {
      res.status(401).json({msg:'post cannot be deleted'})
    }
    await post.remove()

    res.status(200).json({msg:'post deleted'})
  }catch(err){
    console.error(err.message)
    if(err.kind == "ObjectId") {
        res.status(401).json({msg:'post cannot be deleted'})
    }
    res.status(500).send('server Error')
  }
})

// route put api/posts/like/:id
// desc add or remove a post's like
// access private

router.put('/like/:id', auth, async (req,res) => {
  try {
     const post = await Post.findById(req.params.id);
     if (!post) {
       return res.status(404).json({ errors: [{ msg: 'Post not found.' }] });
     }
     if (post.likes.some(item => item.user.toString() === req.user.id)) {
       return res.status(400).json({ errors: [{ msg: 'Post already liked.' }] });
     }
     post.likes.push({ user: req.user.id });
     await post.save();
     res.json(post.likes);
   } catch (err) {
     console.error(err);
     if (err.kind === 'ObjectId') {
       return res.status(404).json({ errors: [{ msg: 'Post not found.' }] });
     }
     res.status(500).json({ errors: [{ msg: 'Server error.' }] });
   }
})

// route put api/posts/unlike/:id
// desc add or remove a post's like
// access private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(400).json({ errors: [{ msg: 'Post not found.' }] });
    }
    if (!post.likes.some(item => item.user.toString() === req.user.id)) {
      return res.status(404).json({ errors: [{ msg: 'Post has not been liked.' }] });
    }
    post.likes.pop({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Post not found.' }] });
    }
    res.status(500).json({ errors: [{ msg: 'Server error.' }] });
  }
});


// route post api/posts/comment/:id
// desc add comment to posts
// access private
router.post('/comment/:post_id', [
  auth,
  [
    check('text', 'Text is required.').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ errors: [{ msg: 'Post not found.' }] });
    }

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };

    post.comments.push(newComment);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error.' }] });
  }
});

// route DELETE api/posts/comment/:id
// desc remove comment to posts
// access private
router.delete('/comment/:id/:comment_id', auth, async (req,res) => {
  try {
    const post = await Post.findOne({_id:req.params.id})

    if (!post) {
      res.status(401).json({msg:'comment cannot be removed/ no post'})
    }

    const comment = post.comments.find(comment => comment.id === req.params.comment_id)
    if (!comment) {
      res.status(401).json({msg:'comment cannot be found'})
    }
    if (comment.user.toString() !== req.user.id) {
      res.status(401).json({msg:'user unauthorized'})
    }
    const index = post.comments.map(l => l.id.toString()).indexOf(req.params.comment_id )
    post.comments.splice(index,1)
    await post.save()
    res.status(200).json({msg:`commment removed`})
  }catch(err){
    console.error(err.message)
    if(err.kind == "ObjectId") {
        res.status(401).json({msg:'comment cannot be remove'})
    }
    res.status(500).send('server Error')
  }
})



module.exports = router
