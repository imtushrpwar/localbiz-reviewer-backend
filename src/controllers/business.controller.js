const Business = require("../models/Business");
const QRCode = require("qrcode");

const createSlug = (businessName, city) => {
  return `${businessName}-${city}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const createBusiness = async (req, res) => {
  try {
    const {
      businessName,
      category,
      phone,
      email,
      address,
      city,
      description,
    } = req.body;

    // Validation
    if (
      !businessName ||
      !category ||
      !phone ||
      !email ||
      !address ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // One business per owner
    const existingBusiness = await Business.findOne({
      owner: req.user.id,
    });

    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: "Business already exists",
      });
    }

    // Generate slug
    let slug = createSlug(businessName, city);

    // Ensure uniqueness
    let count = 1;

    while (await Business.findOne({ slug })) {
      slug = `${createSlug(businessName, city)}-${count}`;
      count++;
    }

    // Review URL
    const reviewURL =`https://customer-review-app-five.vercel.app/review/${slug}`;

    // Generate QR
    const qrCode = await QRCode.toDataURL(reviewURL);

    // Save
    const business = await Business.create({
      owner: req.user.id,
      businessName,
      category,
      phone,
      email,
      address,
      description,
      slug,
      qrCode,
    });

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      business,
      reviewURL,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Get Logged-in User Business

const getBusiness = async (req, res) => {
  try {

    const business = await Business.findOne({
      owner: req.user.id,
    }).populate("owner", "name email");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      business,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Update Business

const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({
      owner: req.user.id,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    business.businessName =
      req.body.businessName || business.businessName;

    business.category =
      req.body.category || business.category;

    business.phone =
      req.body.phone || business.phone;

    business.email =
      req.body.email || business.email;

    business.address =
      req.body.address || business.address;

    business.city =
      req.body.city || business.city;

    business.description =
      req.body.description || business.description;

    await business.save();

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      business,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const checkBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({
      owner: req.user.id,
    });

    res.status(200).json({
      success: true,
      hasBusiness: !!business,
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



module.exports = {
  createBusiness,
    getBusiness,
    updateBusiness,
    checkBusiness
};