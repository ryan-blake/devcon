const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const Posts = require('../../models/Post')
const User = require('../../models/User')
const {check, validationResult} = require('express-validator/check')
const request = require('request')
const config = require('config')

// route get api/profiles
// desc get current user profile
// access private
router.get('/me', auth, async (req,res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id}).populate('user',
      ['name','avatar']);
      if (!profile) {
        return res.status(400).json({msg: 'profile not found'})
      }
      res.json(profile)
  } catch(err){
    console.log(err)
    res.status(500).send('server error')
  }
})
// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// route post api/profiles
// post create profile
// access private

router.post('/', [ auth,[
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], async (req,res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  const { company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    youtube,
    twitter,
    facebook,
    linkedin,
  instagram } = req.body

  const profileFields = {};
  profileFields.user = req.user.id
  if(company) profileFields.company = company
  if(website) profileFields.website = website
  if(location) profileFields.location = location
  if(bio) profileFields.bio = bio
  if(status) profileFields.status = status
  if(githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }

  profileFields.social = {}
  if(youtube) profileFields.social.youtube = youtube
  if(twitter) profileFields.social.twitter = twitter
  if(facebook) profileFields.social.facebook = facebook
  if(linkedin) profileFields.social.linkedin = linkedin
  if(instagram) profileFields.social.instagram = instagram
  try {
    let profile = await Profile.findOne({user: req.user.id})
    if (profile) {
      //update profile
      profile = await Profile.findOneAndUpdate({ user: req.user.id},
        {$set:profileFields},
        {new: true}
      );
      return res.json(profile)
    }
    profile = new Profile(profileFields)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('server error')
  }

  profile = new Profile({})

})



// route get api/profile/user/:user_id
// get profile by user ID
// access public

router.get('/user/:user_id', async (req,res) => {
  console.log(req.params.user_id)
  try {
    const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).json({msg:"Profile not found"})
    }
    res.json(profile)
  } catch (err) {
    console.log(err.message)
    if (err.kind == 'ObjectId'){
      return res.status(400).json({msg:"Profile not found"})
    }
    res.status(500).send('server error')
  }
})


// route get api/profile
// get all profile
// access publoc

router.get('/', async (req,res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('server error')
  }
})

// route put api/profile
// put profile, add profile experience
// access private

router.put('/experience',[auth, [

  check('title', 'title is required').not().isEmpty(),
  check('company', 'company is required').not().isEmpty(),
  check('from', 'from is required').not().isEmpty()

]], async (req,res) => {
  //validate checks for errors in req
  const errors = validationResult(req)
  if (!errors) {
    return res.status(400).json({errors: errors.array()})
  }

  const {
    title,company,location,from,to,current,description
  } = req.body
  const newExp = {
    title,company,location,from,to,current,description
  }

  try {
     let profile = await Profile.findOne({user:req.user.id})
     let user = await User.findOne({_id:req.user.id})

     profile.experience.unshift(newExp);
     await profile.save()

     res.json({profile})
  } catch (err) {
    console.log(err.message)
    res.status(500).send('server error')
  }
})


// route delete api/profile/experience
// delete profile, user experience
// access private


router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      exp => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// route put api/profile
// put profile, add profile education
// access private

router.put('/education',[auth, [

  check('school', 'school is required').not().isEmpty(),
  check('degree', 'degree is required').not().isEmpty(),
  check('fieldofstudy', 'fieldofstudy is required').not().isEmpty()

]], async (req,res) => {
  console.log(req.body.company)
  //validate checks for errors in req
  const errors = validationResult(req)
  if (!errors) {
    return res.status(400).json({errors: errors.array()})
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  }

  try {
     let profile = await Profile.findOne({user:req.user.id})
     let user = await User.findOne({_id:req.user.id})

     profile.education.unshift(newEdu);
     await profile.save()

     res.json({profile})
  } catch (err) {
    console.log(err.message)
    res.status(500).send('server error')
  }
})


// route delete api/profile/education
// delete profile, user education
// access private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    const eduIds = foundProfile.education.map(edu => edu._id.toString());
    const removeIndex = eduIds.indexOf(req.params.edu_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: 'Server error' });
    } else {
      foundProfile.education.splice(removeIndex, 1);
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// route delete api/profile
// delete profile, user & posts
// access private

router.delete('/', auth, async (req,res) => {
  try {
    //todo remove User posts
     await Posts.deleteMany({user:req.user.id})
     await Profile.findOneAndRemove({user:req.user.id})
     await User.findOneAndRemove({_id:req.user.id})
     res.json({msg:'user has been deleted'})
  } catch (err) {
    console.log(err.message)
    res.status(500).send('server error')
  }
})


// route GET api/profile/education
// get github profile repo
// access public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:desc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };
    await request.get(options, async (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({ errors: [{ msg: 'No github profile found.' }] });
      } else {
        res.json(JSON.parse(body));
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error.' }] });
  }
});




module.exports = router
