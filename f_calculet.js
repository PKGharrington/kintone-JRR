// (function() {
//   "use strict";

//   // ตั้งค่า event เวลาเปลี่ยนค่า "ทอพับ" ในตาราง
//   kintone.events.on([
//     "app.record.create.change.F_number",
//     "app.record.edit.change.F_number"
//   ], function(event) {
//     var record = event.record;

//     // น้ำหนักต่อพับ fix เป็น 20
//     var weightPerFold = 20;

//     // วนลูปทุกแถวในตาราง
//     var table = record["Table_MC_Q"].value;
//     for (var i = 0; i < table.length; i++) {
//       var row = table[i].value;

//       var folds = Number(row["F_number"].value || 0); // จำนวนทอพับ
//       var totalWeight = folds * weightPerFold; // คำนวณน้ำหนักรวม

//       row["weight_results_1"].value = totalWeight; // ใส่ค่าในช่องน้ำหนักรวม
//     }

//     return event;
//   });
// })();


(function() {
  "use strict";

  // ฟิลด์โค้ด (ต้องเปลี่ยนตามฟิลด์จริงในแอปของคุณ)
  var TABLE_CODE = "Table_MC_Q";         // โค้ดของตาราง
  var FOLD_CODE = "F_number";       // ฟิลด์ "ทอพับ"
  var WEIGHT_PER_FOLD = "weightPerFold_1";   // ฟิลด์ "น้ำหนักต่อพับ"
  var TOTAL_WEIGHT = "weight_results_1";       // ฟิลด์ "น้ำหนักรวม"

  // Event เมื่อเปลี่ยนค่าในฟิลด์ "ทอพับ"
  kintone.events.on([
    "app.record.create.change." + FOLD_CODE,
    "app.record.edit.change." + FOLD_CODE
  ], function(event) {
    var record = event.record;

    // วน loop ในตาราง
    record[TABLE_CODE].value.forEach(function(row) {
      var folds = Number(row.value[FOLD_CODE].value || 0);

      // กำหนดค่าน้ำหนักต่อพับเป็น 20 ตายตัว
      row.value[WEIGHT_PER_FOLD].value = 20;

      // คำนวณน้ำหนักรวม
      row.value[TOTAL_WEIGHT].value = folds * 20;
    });

    return event;
  });
})();

