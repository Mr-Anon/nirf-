# class College:
#     def __init__(self, name, academic_reputation, faculty_student_ratio, graduation_rate, tuition_fee):
#         self.name = name
#         self.academic_reputation = academic_reputation
#         self.faculty_student_ratio = faculty_student_ratio
#         self.graduation_rate = graduation_rate
#         self.tuition_fee = tuition_fee

#     def __repr__(self):
#         return f"College(name='{self.name}', academic_reputation={self.academic_reputation}, " \
#                f"faculty_student_ratio={self.faculty_student_ratio}, graduation_rate={self.graduation_rate}, " \
#                f"tuition_fee={self.tuition_fee})"


# def is_dominated(college1, college2):
#     """
#     Check if college1 is dominated by college2 in all dimensions.
#     """
#     if (college1.academic_reputation >= college2.academic_reputation and
#             college1.faculty_student_ratio >= college2.faculty_student_ratio and
#             college1.graduation_rate >= college2.graduation_rate and
#             college1.tuition_fee <= college2.tuition_fee):
#         return True
#     return False


# def skyline(colleges):
#     """
#     Find skyline colleges from the given list based on multiple attributes.
#     """
#     skyline_colleges = []
#     for college in colleges:
#         is_skyline = True
#         for other_college in colleges:
#             if college != other_college and is_dominated(other_college, college):
#                 is_skyline = False
#                 break
#         if is_skyline:
#             skyline_colleges.append(college)
#     return skyline_colleges


# # Sample data
# colleges = [
#     College("College A", 9, 12, 80, 20000),
#     College("College B", 8, 15, 75, 18000),
#     College("College C", 7, 10, 85, 22000),
#     College("College D", 9, 13, 70, 19000),
#     College("College E", 6, 11, 78, 21000)
# ]

# # Finding skyline colleges
# skyline_colleges = skyline(colleges)

# # Printing skyline colleges
# print("Skyline colleges:")
# for college in skyline_colleges:
#     print(college)

import random

class College:
    def __init__(self, name, academic_reputation, faculty_student_ratio, graduation_rate, tuition_fee):
        self.name = name
        self.academic_reputation = academic_reputation
        self.faculty_student_ratio = faculty_student_ratio
        self.graduation_rate = graduation_rate
        self.tuition_fee = tuition_fee

    def __repr__(self):
        return f"College(name='{self.name}', academic_reputation={self.academic_reputation}, " \
               f"faculty_student_ratio={self.faculty_student_ratio}, graduation_rate={self.graduation_rate}, " \
               f"tuition_fee={self.tuition_fee})"


def is_dominated(college1, college2):
    """
    Check if college1 is dominated by college2 in all dimensions.
    """
    if (college1.academic_reputation >= college2.academic_reputation and
            college1.faculty_student_ratio >= college2.faculty_student_ratio and
            college1.graduation_rate >= college2.graduation_rate and
            college1.tuition_fee <= college2.tuition_fee):
        return True
    return False


def skyline(colleges):
    """
    Find skyline colleges from the given list based on multiple attributes.
    """
    skyline_colleges = []
    for college in colleges:
        is_skyline = True
        for other_college in colleges:
            if college != other_college and is_dominated(other_college, college):
                is_skyline = False
                break
        if is_skyline:
            skyline_colleges.append(college)
    return skyline_colleges


# Generating sample data for 100 colleges
colleges = []
for i in range(100):
    college_name = f"College {i+1}"
    academic_reputation = random.randint(1, 10)
    faculty_student_ratio = random.uniform(5, 20)
    graduation_rate = random.randint(50, 100)
    tuition_fee = random.randint(10000, 50000)
    colleges.append(College(college_name, academic_reputation, faculty_student_ratio, graduation_rate, tuition_fee))

# Finding skyline colleges
skyline_colleges = skyline(colleges)

# Printing skyline colleges
print("Skyline colleges:")
for college in skyline_colleges:
    print(college)
