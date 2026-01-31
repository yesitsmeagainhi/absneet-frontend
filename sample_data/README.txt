SAMPLE DATA FILES FOR NEET APP
==============================

This folder contains sample CSV files that can be opened in Excel for bulk uploading MCQs and chapters to Firestore.

FILES:
------
1. chapters.csv - Sample chapter data
2. mcqs.csv - Sample MCQ questions with all fields

HOW TO USE:
-----------
1. Open the CSV files in Microsoft Excel or Google Sheets
2. Edit/Add your data following the same column structure
3. Save as CSV or Excel format
4. Upload to Firestore using your admin panel or upload script

COLUMN DESCRIPTIONS FOR mcqs.csv:
---------------------------------
questionId      : Unique ID for the question (required)
chapterId       : Reference to parent chapter (required)
subjectId       : Subject ID - physics/chemistry/biology (required)
unitId          : Reference to parent unit (required)
question        : The question text (required)
optionA         : First option (required)
optionB         : Second option (required)
optionC         : Third option (required)
optionD         : Fourth option (required)
correctOption   : Correct answer - A, B, C, or D (required)
explanation     : Explanation for the answer (optional)
qImage          : URL for question image (optional)
optionAImage    : URL for option A image (optional)
optionBImage    : URL for option B image (optional)
optionCImage    : URL for option C image (optional)
optionDImage    : URL for option D image (optional)
explanationImage: URL for explanation image (optional)

COLUMN DESCRIPTIONS FOR chapters.csv:
-------------------------------------
chapterId   : Unique ID for the chapter (required)
chapterName : Name of the chapter (required)
subjectId   : Parent subject ID (required)
unitId      : Parent unit ID (required)
order       : Display order number (required)
active      : TRUE or FALSE (required)

NOTES:
------
- For image fields, upload images to Firebase Storage first and use the download URLs
- Leave image columns empty if not needed
- Use uppercase A, B, C, or D for correctOption
- Keep IDs consistent across files (e.g., ch_phy_01 format)
