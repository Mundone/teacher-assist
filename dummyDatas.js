const surveys = [
  {
    survey_title: "Survey 1",
    description: "This is the first survey",
  },
  {
    survey_title: "Survey 2",
    description: "This is the second survey",
  },
];

const questions = [
  {
    question_text: "What is your favorite color?",
    placeholder: "Enter your favorite color",
    type: "free_text",
  },
  {
    question_text: "Select your favorite fruit.",
    placeholder: "Choose from the list",
    type: "single_selection",
  },
];

const offeredAnswers = [
  {
    value: "Red",
  },
  {
    value: "Apple",
  },
];

const responses = [
  {
    student_id: 1,
    question_id: 1,
    answer_text: "Blue",
  },
  {
    student_id: 2,
    question_id: 2,
    answer_text: "Banana",
  },
];

const students = [
  {
    name: "Student1",
    student_code: "Student1",
    email: "Student1",
    password: "Student1",
  },
  {
    name: "Student2",
    student_code: "Student2",
    email: "Student2",
    password: "Student2",
  },
];

const lessonTypes = [
  {
    name: "Лекц",
    code: "лк",
    count: 16,
    parent_lesson_type_id: 0,
    sort: 1,
    is_attendance_add: true,
  },
  {
    name: "Лекц тэгш",
    code: "лктэгш",
    count: 8,
    parent_lesson_type_id: 1,
    sort: 2,
    is_attendance_add: true,
  },
  {
    name: "Лекц сондгой",
    code: "лксонд",
    count: 8,
    parent_lesson_type_id: 1,
    sort: 3,
    is_attendance_add: true,
  },
  {
    name: "Лаборатор",
    code: "лаб",
    count: 16,
    parent_lesson_type_id: 0,
    sort: 4,
    is_attendance_add: false,
  },
  {
    name: "Лаборатор тэгш",
    code: "лабтэгш",
    count: 8,
    parent_lesson_type_id: 4,
    sort: 5,
    is_attendance_add: false,
  },
  {
    name: "Лаборатор сондгой",
    code: "лабсонд",
    count: 8,
    parent_lesson_type_id: 4,
    sort: 6,
    is_attendance_add: false,
  },
  {
    name: "Семинар",
    code: "сем",
    count: 16,
    parent_lesson_type_id: 0,
    sort: 7,
    is_attendance_add: false,
  },
  {
    name: "Семинар тэгш",
    code: "семтэгш",
    count: 8,
    parent_lesson_type_id: 7,
    sort: 8,
    is_attendance_add: false,
  },
  {
    name: "Семинар сондгой",
    code: "семсонд",
    count: 8,
    parent_lesson_type_id: 7,
    sort: 9,
    is_attendance_add: false,
  },
  {
    name: "Бие даалт",
    code: "бд",
    count: 3,
    parent_lesson_type_id: 0,
    sort: 10,
    is_attendance_add: false,
  },
  {
    name: "Практик",
    code: "пр",
    count: 5,
    parent_lesson_type_id: 0,
    sort: 11,
    is_attendance_add: false,
  },
];
const lectureLessonAssessments = [
  {
    code: "CF1",
    desc: "Цаг төлөвлөлт, хариуцлага",
    def_grade: 5,
    sort: 1,
    is_attendance_add: true,
  },
  {
    code: "CF2",
    desc: "Сурах хүсэл эрмэлзлэл, өөрийгөө илэрхийлэх",
    def_grade: 5,
    sort: 2,
    is_attendance_add: false,
  },
];

const sorilLessonAssessments = [
  {
    code: "CT3",
    desc: "Мэдлэгээ сэргээн санах, тайлбарлах",
    def_grade: 5,
    sort: 3,
    is_attendance_add: false,
  },
  {
    code: "CT4",
    desc: "Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх",
    def_grade: 5,
    sort: 4,
    is_attendance_add: false,
  },
  {
    code: "CT5",
    desc: "Мэдлэгээ сэргээн санах, тайлбарлах",
    def_grade: 5,
    sort: 5,
    is_attendance_add: false,
  },
  {
    code: "CT6",
    desc: "Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх",
    def_grade: 5,
    sort: 6,
    is_attendance_add: false,
  },
];

const laboratoryLessonAssessments = [
  {
    code: "CD7",
    desc: "Лабаораторийн хэмжилт, туршилт, даалгавар гүйцэтгэх",
    def_grade: 15,
    sort: 7,
    is_attendance_add: false,
  },
  {
    code: "CD8",
    desc: "Үр дүнг тохирох аргаар, өгөгдсөн форматын дагуу боловсруулж тайлагнах",
    def_grade: 5,
    sort: 8,
    is_attendance_add: false,
  },
];

const seminarLessonAssessments = [
  {
    code: "CD7",
    desc: "Лабаораторийн хэмжилт, туршилт, даалгавар гүйцэтгэх",
    def_grade: 15,
    sort: 7,
    is_attendance_add: false,
  },
  {
    code: "CD8",
    desc: "Үр дүнг тохирох аргаар, өгөгдсөн форматын дагуу боловсруулж тайлагнах",
    def_grade: 5,
    sort: 8,
    is_attendance_add: false,
  },
];

const assignmentLessonAssessments = [
  {
    code: "CD9",
    desc: "Өгөгдсөн даалгаврын хүрээнд шийдвэрлэх асуудлаа тодорхойлж, томёолох",
    def_grade: 5,
    sort: 9,
    is_attendance_add: false,
  },
  {
    code: "CD10",
    desc: "Шийдвэрлэх асуудлын хүрээнд тодорхой шийдэл дэвшүүлэх, дүн шинжилгээ хийх",
    def_grade: 5,
    sort: 10,
    is_attendance_add: false,
  },
  {
    code: "CD11",
    desc: "Мэдлэг ур чадвараа ашиглан сонгосон шийдлийн дагуу асуудлыг шийдвэрлэх",
    def_grade: 5,
    sort: 11,
    is_attendance_add: false,
  },
  {
    code: "CD12",
    desc: "Бичгийн болон харилцах ур чадвараа ашиглан үр дүнг өгөгдсөн форматын дагуу тайлагнах илтгэх",
    def_grade: 5,
    sort: 12,
    is_attendance_add: false,
  },
];

const testLessonAssessments = [
  {
    code: "XX1",
    desc: "Тест үнэлгээ 1...",
    def_grade: 5,
    sort: 13,
    is_attendance_add: false,
  },
  {
    code: "XX2",
    desc: "Тест үнэлгээ 2...",
    def_grade: 5,
    sort: 14,
    is_attendance_add: false,
  },
];

const subjectCodes = [
  "F.CS101",
  "F.CS102",
  "S.ML103",
  "S.MT101",
  "S.PH101",
  "S.SS102",
  "F.CS100",
  "S.CE102",
  "F.EE101",
  "S.MT102",
];

const scheduleNames = [
  "Даваа: 1-р паар",
  "Даваа: 2-р паар",
  "Даваа: 3-р паар",
  "Даваа: 4-р паар",
  "Даваа: 5-р паар",
  "Даваа: 6-р паар",
  "Даваа: 7-р паар",

  "Мягмар: 1-р паар",
  "Мягмар: 2-р паар",
  "Мягмар: 3-р паар",
  "Мягмар: 4-р паар",
  "Мягмар: 5-р паар",
  "Мягмар: 6-р паар",
  "Мягмар: 7-р паар",

  "Лхагва: 1-р паар",
  "Лхагва: 2-р паар",
  "Лхагва: 3-р паар",
  "Лхагва: 4-р паар",
  "Лхагва: 5-р паар",
  "Лхагва: 6-р паар",
  "Лхагва: 7-р паар",

  "Пүрэв: 1-р паар",
  "Пүрэв: 2-р паар",
  "Пүрэв: 3-р паар",
  "Пүрэв: 4-р паар",
  "Пүрэв: 5-р паар",
  "Пүрэв: 6-р паар",
  "Пүрэв: 7-р паар",

  "Баасан: 1-р паар",
  "Баасан: 2-р паар",
  "Баасан: 3-р паар",
  "Баасан: 4-р паар",
  "Баасан: 5-р паар",
  "Баасан: 6-р паар",
  "Баасан: 7-р паар",
];

const scheduleDays = [
  1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
  4, 4, 5, 5, 5, 5, 5, 5, 5,
];

const scheduleTimes = [
  1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5,
  6, 7, 1, 2, 3, 4, 5, 6, 7,
];

const menuDatas = [
  {
    menu_code: "00",
    parent_id: 0,
    menu_name: "ХЯНАЛТ",
    router_link: "",
    sorted_order: 0,
    icon_name: "",
  },
  {
    menu_code: "01",
    parent_id: 0,
    menu_name: "ҮНДСЭН ХЭСЭГ",
    router_link: "",
    sorted_order: 1,
    icon_name: "",
  },
  {
    menu_code: "02",
    parent_id: 0,
    menu_name: "БҮРТГЭЛ",
    router_link: "",
    sorted_order: 2,
    icon_name: "",
  },
  {
    menu_code: "0001",
    parent_id: 1,
    menu_name: "Дашбоард",
    router_link: "/dashboard",
    sorted_order: 1,
    icon_name: "material-symbols:dashboard-outline",
  },
  // {
  //   menu_code: "0002",
  //   parent_id: 1,
  //   menu_name: "Салбар сургууль",
  //   router_link: "/dashboard/subSchools",
  //   sorted_order: 2,
  //   icon_name: "material-symbols:dashboard-outline",
  // },
  {
    menu_code: "0101",
    parent_id: 2,
    menu_name: "Хичээл",
    router_link: "/dashboard/subject",
    sorted_order: 1,
    icon_name: "streamline:class-lesson",
  },
  {
    menu_code: "0102",
    parent_id: 2,
    menu_name: "Хичээлийн задаргаа",
    router_link: "/dashboard/lessons",
    sorted_order: 2,
    icon_name: "nonicons-class-16",
  },
  {
    menu_code: "0103",
    parent_id: 2,
    menu_name: "Хичээл орох хэлбэр",
    router_link: "/dashboard/lessonTypes",
    sorted_order: 3,
    icon_name: "mdi:blackboard",
  },
  {
    menu_code: "0104",
    parent_id: 2,
    menu_name: "Дүнгийн задаргаа",
    router_link: "/dashboard/lessonAsses",
    sorted_order: 4,
    icon_name: "clarity:tree-view-line",
  },
  {
    menu_code: "0105",
    parent_id: 2,
    menu_name: "Оюутнууд",
    router_link: "/dashboard/students",
    sorted_order: 4,
    icon_name: "ph:student",
  },
  {
    menu_code: "0106",
    parent_id: 2,
    menu_name: "Төсөл, диплом үзлэг",
    router_link: "/dashboard/projects",
    sorted_order: 5,
    icon_name: "material-symbols-light:subject",
  },
  {
    menu_code: "0107",
    parent_id: 2,
    menu_name: "Дүн",
    router_link: "/dashboard/grades",
    sorted_order: 6,
    icon_name: "solar:document-add-broken",
  },
  {
    menu_code: "0108",
    parent_id: 2,
    menu_name: "Санал асуулга",
    router_link: "/dashboard/survey",
    sorted_order: 7,
    icon_name: "wpf:survey",
  },
  {
    menu_code: "0201",
    parent_id: 3,
    menu_name: "Хэрэглэгч",
    router_link: "/dashboard/users",
    sorted_order: 1,
    icon_name: "mdi:user-outline",
  },
  {
    menu_code: "0202",
    parent_id: 3,
    menu_name: "Хэрэглэгчийн бүлэг",
    router_link: "/dashboard/userRole",
    sorted_order: 2,
    icon_name: "mdi:user-group-outline",
  },
  {
    menu_code: "0203",
    parent_id: 3,
    menu_name: "Багшийн портфолио",
    router_link: "/dashboard/userFile",
    sorted_order: 3,
    icon_name: "material-symbols-light:subject",
  },
];

const adminMenuCodes = [
  "00",
  "0001",
  // "0002",
  "01",
  "0103",
  "0104",
  "02",
  "0201",
  "0202",
];
const headOfDepartmentMenuCodes = [
  "00",
  "0001",
  "01",
  // "0106",
  // "02",
  //  "0203"
];
const teacherMenuCodes = [
  "00",
  "0001",
  "01",
  "0101",
  "0107",
  "0108",
  // "0106",
  // "02",
  //  "0203"
];

module.exports = {
  lessonTypes,
  lectureLessonAssessments,
  sorilLessonAssessments,
  laboratoryLessonAssessments,
  assignmentLessonAssessments,
  testLessonAssessments,
  subjectCodes,
  scheduleNames,
  scheduleDays,
  scheduleTimes,
  menuDatas,
  adminMenuCodes,
  headOfDepartmentMenuCodes,
  teacherMenuCodes,
  seminarLessonAssessments,
  surveys,
  questions,
  offeredAnswers,
  responses,
  students,
};
