const express = require('express');
const router = express.Router();
const College = require('../models/College');
const Cutoffs = require('../models/Cutoffs');
const rankColleges = require('../ranking/defaultRankingFunc');
const weights = require('../ranking/defaultWeights');

// @route POST api/applicant/register
// @desc Register user
// @access Public
router.post("/addCollege", (req, res) => {

  College.findOne({ code: req.body.code }).then(college => {
    if (college) {
      console.log("hello")
      console.log(college)
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
        .catch(err => console.log(err));
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
    console.error(error);
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
      console.log("hello")
      console.log(college)
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
      console.log("hello")
      console.log(college)
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
    console.log(colleges);
    if (colleges.length > 0) {
      return res.status(200).json(rankColleges({ college: colleges }, weights));
    } else {
      return res.status(400).json({ error: "No colleges" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" + error });
  }
});

module.exports = router;