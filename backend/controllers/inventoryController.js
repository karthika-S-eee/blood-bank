// const mongoose = require("mongoose");
// const inventoryModel = require("../models/inventoryModel");
// const userModel = require("../models/userModel");

// // CREATE INVENTORY
// const createInventoryController = async (req, res) => {
//   try {
//     const { email } = req.body;
//     //validation
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       throw new Error("User Not Found");
//     }
//     if (req.body.inventoryType === "in" && user.role !== "donar") {
//       throw new Error("Not a donar account");
//     }
//     if (req.body.inventoryType === "out" && user.role !== "hospital") {
//       throw new Error("Not a hospital");
//     }

//     if (req.body.inventoryType == "out") {
//       const requestedBloodGroup = req.body.bloodGroup;
//       const requestedQuantityOfBlood = req.body.quantity;
//       const organisation = new mongoose.Types.ObjectId(req.body.userId);
//       //calculate Blood Quanitity
//       const totalInOfRequestedBlood = await inventoryModel.aggregate([
//         {
//           $match: {
//             organisation,
//             inventoryType: "in",
//             bloodGroup: requestedBloodGroup,
//           },
//         },
//         {
//           $group: {
//             _id: "$bloodGroup",
//             total: { $sum: "$quantity" },
//           },
//         },
//       ]);
//       // console.log("Total In", totalInOfRequestedBlood);
//       const totalIn = totalInOfRequestedBlood[0]?.total || 0;
//       //calculate OUT Blood Quanitity

//       const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
//         {
//           $match: {
//             organisation,
//             inventoryType: "out",
//             bloodGroup: requestedBloodGroup,
//           },
//         },
//         {
//           $group: {
//             _id: "$bloodGroup",
//             total: { $sum: "$quantity" },
//           },
//         },
//       ]);
//       const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

//       //in & Out Calc
//       const availableQuanityOfBloodGroup = totalIn - totalOut;
//       //quantity validation
//       if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
//         return res.status(500).send({
//           success: false,
//           message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
//         });
//       }
//       req.body.hospital = user?._id;
//     } else {
//       req.body.donar = user?._id;
//     }

//     //save record
//     const inventory = new inventoryModel(req.body);
//     await inventory.save();
//     return res.status(201).send({
//       success: true,
//       message: "New Blood Reocrd Added",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Errro In Create Inventory API",
//       error,
//     });
//   }
// };

// // GET ALL BLOOD RECORS
// const getInventoryController = async (req, res) => {
//   try {
//     const inventory = await inventoryModel
//       .find({
//         organisation: req.body.userId,
//       })
//       .populate("donar")
//       .populate("hospital")
//       .sort({ createdAt: -1 });
//     return res.status(200).send({
//       success: true,
//       messaage: "get all records successfully",
//       inventory,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In Get All Inventory",
//       error,
//     });
//   }
// };
// // GET Hospital BLOOD RECORS
// const getInventoryHospitalController = async (req, res) => {
//   try {
//     const inventory = await inventoryModel
//       .find(req.body.filters)
//       .populate("donar")
//       .populate("hospital")
//       .populate("organisation")
//       .sort({ createdAt: -1 });
//     return res.status(200).send({
//       success: true,
//       messaage: "get hospital comsumer records successfully",
//       inventory,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In Get consumer Inventory",
//       error,
//     });
//   }
// };

// // GET BLOOD RECORD OF 3
// const getRecentInventoryController = async (req, res) => {
//   try {
//     const inventory = await inventoryModel
//       .find({
//         organisation: req.body.userId,
//       })
//       .limit(3)
//       .sort({ createdAt: -1 });
//     return res.status(200).send({
//       success: true,
//       message: "recent Invenotry Data",
//       inventory,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In Recent Inventory API",
//       error,
//     });
//   }
// };

// // GET DONAR REOCRDS
// const getDonarsController = async (req, res) => {
//   try {
//     const organisation = req.body.userId;
//     //find donars
//     const donorId = await inventoryModel.distinct("donar", {
//       organisation,
//     });
//     // console.log(donorId);
//     const donars = await userModel.find({ _id: { $in: donorId } });

//     return res.status(200).send({
//       success: true,
//       message: "Donar Record Fetched Successfully",
//       donars,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error in Donar records",
//       error,
//     });
//   }
// };

// const getHospitalController = async (req, res) => {
//   try {
//     const organisation = req.body.userId;
//     //GET HOSPITAL ID
//     const hospitalId = await inventoryModel.distinct("hospital", {
//       organisation,
//     });
//     //FIND HOSPITAL
//     const hospitals = await userModel.find({
//       _id: { $in: hospitalId },
//     });
//     return res.status(200).send({
//       success: true,
//       message: "Hospitals Data Fetched Successfully",
//       hospitals,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In get Hospital API",
//       error,
//     });
//   }
// };

// // GET ORG PROFILES
// const getOrgnaisationController = async (req, res) => {
//   try {
//     const donar = req.body.userId;
//     const orgId = await inventoryModel.distinct("organisation", { donar });
//     //find org
//     const organisations = await userModel.find({
//       _id: { $in: orgId },
//     });
//     return res.status(200).send({
//       success: true,
//       message: "Org Data Fetched Successfully",
//       organisations,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In ORG API",
//       error,
//     });
//   }
// };
// // GET ORG for Hospital
// const getOrgnaisationForHospitalController = async (req, res) => {
//   try {
//     const hospital = req.body.userId;
//     const orgId = await inventoryModel.distinct("organisation", { hospital });
//     //find org
//     const organisations = await userModel.find({
//       _id: { $in: orgId },
//     });
//     return res.status(200).send({
//       success: true,
//       message: "Hospital Org Data Fetched Successfully",
//       organisations,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In Hospital ORG API",
//       error,
//     });
//   }
// };

// module.exports = {
//   createInventoryController,
//   getInventoryController,
//   getDonarsController,
//   getHospitalController,
//   getOrgnaisationController,
//   getOrgnaisationForHospitalController,
//   getInventoryHospitalController,
//   getRecentInventoryController,
// };

const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { email, inventoryType, bloodGroup, quantity, userId } = req.body;

    // validation
    if (!email || !inventoryType || !bloodGroup || !quantity || !userId) {
      return res.status(400).send({
        success: false,
        message: "All fields (email, inventoryType, bloodGroup, quantity, userId) are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    // role validation
    if (inventoryType === "in" && user.role !== "donar") {
      return res.status(400).send({
        success: false,
        message: "Only donor accounts can add 'in' inventory",
      });
    }
    if (inventoryType === "out" && user.role !== "hospital") {
      return res.status(400).send({
        success: false,
        message: "Only hospital accounts can request 'out' inventory",
      });
    }

    // blood stock calculation for "out"
    if (inventoryType === "out") {
      const organisation = new mongoose.Types.ObjectId(userId);

      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      const availableQuantityOfBloodGroup = totalIn - totalOut;

      if (availableQuantityOfBloodGroup < quantity) {
        return res.status(400).send({
          success: false,
          message: `Only ${availableQuantityOfBloodGroup}ML of ${bloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user._id;
    } else {
      req.body.donar = user._id;
    }

    // save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();

    return res.status(201).send({
      success: true,
      message: "New Blood Record Added",
      inventory,
    });
  } catch (error) {
    console.error("Error in createInventoryController:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Error In Create Inventory API",
    });
  }
};

// GET ALL BLOOD RECORDS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ organisation: req.body.userId })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Fetched all inventory records successfully",
      inventory,
    });
  } catch (error) {
    console.error("Error in getInventoryController:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Error In Get All Inventory",
    });
  }
};

// GET Hospital BLOOD RECORDS
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Fetched hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.error("Error in getInventoryHospitalController:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Error In Get consumer Inventory",
    });
  }
};

// GET BLOOD RECORD OF LAST 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ organisation: req.body.userId })
      .limit(3)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Recent Inventory Data",
      inventory,
    });
  } catch (error) {
    console.error("Error in getRecentInventoryController:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Error In Recent Inventory API",
    });
  }
};

// GET DONOR RECORDS
const getDonarsController = async (req, res) => {
  try {
    const organisation = req.body.userId;

    const donorIds = await inventoryModel.distinct("donar", { organisation });
    const donars = await userModel.find({ _id: { $in: donorIds } });

    return res.status(200).send({
      success: true,
      message: "Donor records fetched successfully",
      donars,
    });
  } catch (error) {
    console.error("Error in getDonarsController:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Error in Donor records",
    });
  }
};

// GET HOSPITAL RECORDS
const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;

    const hospitalIds = await inventoryModel.distinct("hospital", { organisation });
    const hospitals = await userModel.find({ _id: { $in: hospitalIds } });

    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.error("Error in getHospitalController:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Error In get Hospital API",
    });
  }
};

// GET ORG PROFILES FOR DONORS
const getOrgnaisationController = async (req, res) => {
  try {
    const donar = req.body.userId;

    const orgIds = await inventoryModel.distinct("organisation", { donar });
    const organisations = await userModel.find({ _id: { $in: orgIds } });

    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.error("Error in getOrgnaisationController:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Error In ORG API",
    });
  }
};

// GET ORG PROFILES FOR HOSPITALS
const getOrgnaisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;

    const orgIds = await inventoryModel.distinct("organisation", { hospital });
    const organisations = await userModel.find({ _id: { $in: orgIds } });

    return res.status(200).send({
      success: true,
      message: "Hospital Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.error("Error in getOrgnaisationForHospitalController:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Error In Hospital ORG API",
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalController,
  getOrgnaisationController,
  getOrgnaisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
};
