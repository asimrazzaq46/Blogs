const Tags = require("../../models/tags");
const catchAsynError = require("../../middlewares/catchAsncError");

const slugify = require("slugify");

//Create Tag
exports.createTag = catchAsynError(async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();
    const tag = await Tags.create({ name, slug });
    res.status(201).json(tag);
  } catch (error) {
    res.status(404).json({ error });
  }
});

//ALL tags list
exports.allTags = catchAsynError(async (req, res) => {
  try {
    const tags = await Tags.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(404).json({ error });
  }
});
  
//one tag
exports.oneTag = catchAsynError(async (req, res) => {
  try {
    
    const tag = await Tags.findOne({ slug: req.params.slug.toLowerCase() });

    if (!tag) {
      res.status(404).json({ error: "Tags not Found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(404).json({ error });
  }
});

//Delete tag
exports.deleteTag = catchAsynError(async (req, res) => {
  try {
    const { slug } = req.params;
    const tag = await Tags.findOne({ slug });
    if (!tag) {
      res.status(404).json({ error: "Tags not Found" });
    }
    await Tags.findOneAndDelete({ slug });
    res.status(200).json({ message: "Deleted Successfully!" });
  } catch (error) {
    res.status(404).json({ error });
  }
});
