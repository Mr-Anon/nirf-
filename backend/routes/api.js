const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const College = require('../models/College');
const Cutoffs = require('../models/Cutoffs');
const rankColleges = require('../ranking/defaultRankingFunc');
const rankToggledColleges = require('../ranking/toggledRankingFunc');
const weights = require('../ranking/defaultWeights');
const toggles = require('../toggles/defaultToggles');
const skyline = require('../Skyline/defaultSkylineValues');
const generateFilters = require('../filters/defaultfilterValues');
const cutoffFunc = require("../cutoffToggles/getBranchToggles");
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

async function getUniqueElements(arr) {
  const uniqueElements = new Set();
  arr.forEach(async (subArray) => {
    subArray[1].forEach(async (element) => {
      await uniqueElements.add(element);
    })
  });
  return Array.from(uniqueElements);
}



// @route POST api/applicant/register
// @desc Register user
// @access Public
router.post("/addCollege", (req, res) => {

  College.findOne({ name: req.body.name }).then(college => {
    if (college) {
      // console.log("hello")
      // console.log(college)
      return res.status(400).json({ error: " college already exists" });
    }
    else {
      const { name, code, ssDataArray, fulltime_phd, parttime_phd, amount_received_research, pcs_lift_ramps, pcs_wheelchair, pcs_designed_toilets, no_of_faculty, data_link } = req.body;
      const newCollege = new College({
        name: name,
        code: code,
        ssDataArray: ssDataArray,
        fulltime_phd: fulltime_phd,
        parttime_phd: parttime_phd,
        amount_received_research: amount_received_research,
        pcs_lift_ramps: pcs_lift_ramps,
        pcs_wheelchair: pcs_wheelchair,
        pcs_designed_toilets: pcs_designed_toilets,
        no_of_faculty: no_of_faculty,
        data_link: data_link,
      });
      newCollege
        .save()
        .then(college => {
          res.json(college)

        })
      // .catch(err => console.log(err));
    }
  });
}
);


// @route POST api/applicant/register
// @desc Register user
// @access Public
router.post("/addCutoff", async (req, res) => {
  try {
    const {
      institute_name,
      Academic_Program_Name,
      Quota,
      Seat_Type,
      Gender,
      Opening_Rank,
      Closing_Rank
    } = req.body;

    // Check if a document with the same institute_name exists
    const existingCutoffs = await Cutoffs.findOne({ institute_name });

    if (existingCutoffs) {
      let existingProgram = existingCutoffs.academic_programs.find(
        (program) => program.academic_program_name === Academic_Program_Name
      );

      if (!existingProgram) {
        // Create a new academic program within the existing institute
        existingProgram = {
          academic_program_name: Academic_Program_Name,
          quotas: [
            {
              quota_name: Quota,
              seat_types: [
                {
                  seat_type_name: Seat_Type,
                  genders: [
                    {
                      gender_name: Gender,
                      ranks: [
                        {
                          opening_rank: Opening_Rank,
                          closing_rank: Closing_Rank
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        };

        existingCutoffs.academic_programs.push(existingProgram);
      } else {
        // Check if a document with the same quota_name exists
        let existingQuota = existingProgram.quotas.find(
          (quota) => quota.quota_name === Quota
        );

        if (!existingQuota) {
          // Create a new quota within the existing academic program
          existingQuota = {
            quota_name: Quota,
            seat_types: [
              {
                seat_type_name: Seat_Type,
                genders: [
                  {
                    gender_name: Gender,
                    ranks: [
                      {
                        opening_rank: Opening_Rank,
                        closing_rank: Closing_Rank
                      }
                    ]
                  }
                ]
              }
            ]
          };

          existingProgram.quotas.push(existingQuota);
        } else {
          // Check if a document with the same seat_type_name exists
          let existingSeatType = existingQuota.seat_types.find(
            (seatType) => seatType.seat_type_name === Seat_Type
          );

          if (!existingSeatType) {
            // Create a new seat_type within the existing quota
            existingSeatType = {
              seat_type_name: Seat_Type,
              genders: [
                {
                  gender_name: Gender,
                  ranks: [
                    {
                      opening_rank: Opening_Rank,
                      closing_rank: Closing_Rank
                    }
                  ]
                }
              ]
            };

            existingQuota.seat_types.push(existingSeatType);
          } else {
            // Check if a document with the same gender_name exists
            let existingGender = existingSeatType.genders.find(
              (gender) => gender.gender_name === Gender
            );

            if (!existingGender) {
              // Create a new gender within the existing seat_type
              existingGender = {
                gender_name: Gender,
                ranks: [
                  {
                    opening_rank: Opening_Rank,
                    closing_rank: Closing_Rank
                  }
                ]
              };

              existingSeatType.genders.push(existingGender);
            } else {
              // Check if a rank with the same opening and closing ranks exists
              const existingRank = existingGender.ranks.find(
                (rank) =>
                  rank.opening_rank === Opening_Rank &&
                  rank.closing_rank === Closing_Rank
              );

              if (!existingRank) {
                // Create a new rank within the existing gender
                existingGender.ranks.push({
                  opening_rank: Opening_Rank,
                  closing_rank: Closing_Rank
                });
              } else {
                return res.status(400).json({
                  error: 'Duplicate entry. This data already exists.'
                });
              }
            }
          }
        }
      }

      await existingCutoffs.save();
    } else {
      // Create a new document
      const newData = {
        institute_name,
        academic_programs: [
          {
            academic_program_name: Academic_Program_Name,
            quotas: [
              {
                quota_name: Quota,
                seat_types: [
                  {
                    seat_type_name: Seat_Type,
                    genders: [
                      {
                        gender_name: Gender,
                        ranks: [
                          {
                            opening_rank: Opening_Rank,
                            closing_rank: Closing_Rank
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      // Create a new Cutoffs instance and save it to the database
      const newCutoffs = new Cutoffs(newData);
      await newCutoffs.save();
    }

    res.status(201).json({ message: 'Data added or updated successfully' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post("/getCollegeByCode", (req, res) => {

  // console.log(req.body)

  // Form validation
  // const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  College.findOne({ code: req.body.code }).then(college => {
    if (college) {
      // console.log("hello")
      // console.log(college)
      return res.status(200).json({ college });
    }
    else {
      return res.status(400).json({ error: " college does not exists" });

    }
  });
}
);

router.post("/getCollegeByName", (req, res) => {

  // console.log(req.body)

  // Form validation
  // const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  College.find({ name: req.body.name }).then(college => {
    if (college) {
      // console.log("hello")
      // console.log(college)
      return res.status(200).json({ college });
    }
    else {
      return res.status(400).json({ error: " college does not exists" });

    }
  });
}
);

router.get("/getAllCollege", async (req, res) => {
  try {
    const colleges = await College.find();
    // console.log(colleges);
    if (colleges.length > 0) {
      return res.status(200).json(rankColleges({ college: colleges }, weights));
    } else {
      return res.status(400).json({ error: "No colleges" });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});

router.post("/updateCodeToCuttoffId", async (req, res) => {
  try {
    // const colleges = await College.find();
    const cutoff = await Cutoffs.findOne({ institute_name: req.body.cutoffName });
    if (cutoff == null) {
      return res.status(400).json('Cutoff not found');
    }
    const result = await College.findOneAndUpdate(
      { name: req.body.collegeName }, // Filter
      { $set: { code: cutoff._id.toString() } }, // Update operation
      { returnOriginal: false } // Option to return the updated document
    );

    console.log(result)

    if (result != null) {
      return res.status(200).json({ Message: "College code updated successfully:" + result });
    } else {
      return res.status(400).json({ error: "College not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});


router.get("/getAllCollegeUnranked", async (req, res) => {
  try {
    const colleges = await College.find();
    // console.log(colleges);
    if (colleges.length > 0) {
      return res.status(200).json({ college: colleges });
    } else {
      return res.status(400).json({ error: "No colleges" });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});

router.get("/getAllCutoff", async (req, res) => {
  try {
    const cutoff = await Cutoffs.find();
    // console.log(cutoff);
    if (cutoff.length > 0) {
      return res.status(200).json({ cutoff: cutoff });
    } else {
      return res.status(400).json({ error: "No Cutoffs" });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});

router.post("/getToggledColleges", async (req, res) => {
  try {
    // console.log(req.body)
    const colleges = await College.find();
    if (colleges.length > 0) {
      // console.log("asdasd")
      // console.log(req.body.filters)
      return res.status(200).json(await rankToggledColleges({ college: colleges }, weights, req.body));
    } else {
      return res.status(400).json({ error: "No colleges" });
    }

  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});

router.get("/getToggles", async (req, res) => {
  try {
    // console.log(Object.keys(toggles).length)
    const colleges = await College.find();
    let branches = await getUniqueElements(await cutoffFunc.getBranches({ college: colleges }));
    // console.log(branches);
    let togglesList = Object.keys(toggles);
    togglesList.push(...branches);
    if (Object.keys(toggles).length > 0) {
      return res.status(200).json({ toggles: togglesList });
    } else {
      return res.status(400).json({ error: "No toggles" });
    }

  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});



router.get("/getSkylineValues", async (req, res) => {
  try {
    // console.log(Object.keys(skyline).length)
    if (Object.keys(skyline).length > 0) {
      return res.status(200).json({ skyline: Object.keys(skyline) });
    } else {
      return res.status(400).json({ error: "No skyline values" });
    }

  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});

router.get("/getFilterValues", async (req, res) => {
  try {
    const colleges = await College.find();
    let filters = await generateFilters(colleges)
    // console.log(filters)
    // console.log("gjkhgkhgkfhgkghkdhgdkgkdhkdhkdhgkdk")
    // console.log(Object.keys(filters))
    if (Object.keys(filters).length > 0) {
      return res.status(200).json({ filters: filters });
    } else {
      return res.status(400).json({ error: "No filters values" });
    }

  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});

// @route POST api/user/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      const newUser = new User({
        name,
        email,
        password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              return res.status(201).json({ message: "User registered successfully" });
            })
            .catch(err => {
              console.log(err);
              return res.status(500).json({ error: "Internal server error" });
            });
        });
      });
    }
  });
});

// @route POST api/user/login
// @desc Login user
// @access Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Check if the user exists
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    // Check if the password is correct
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Password is correct, generate a token and send it in the response
        const token = generateToken(user);
        // Generate token function
        function generateToken(user) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email
          };

          // Sign token
          return jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });
        }
        return res.status(200).json({ token });
      } else {
        return res.status(400).json({ error: "Incorrect password" });
      }
    });
  }).catch(err => {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  });
});

router.post("/addCutoffIdToUser", async (req, res) => {
  try {
    const { userId, cutoffId } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Add the cutoffId to the user's cutoffIds array
    user.cutoff_ids.push(cutoffId);

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Cutoff ID added to user successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
// module.exports = router;



module.exports = router