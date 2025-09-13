(function() {
  "use strict";

  var TABLE_CODE = "Table_MC_Q";         
  var FOLD_CODE = "F_number";       
  var WEIGHT_PER_FOLD = "weightPerFold_1";   
  var TOTAL_WEIGHT = "weight_results_1";       

  var TOTAL_FOLD_ALL = "totalFoldAll";       
  var REMAIN_FOLD = "remainFold";            

  function updateRemainFold(record) {
    var totalFoldAll = Number(record[TOTAL_FOLD_ALL].value || 0);
    var sumFolds = 0;

    record[TABLE_CODE].value.forEach(function(row) {
      var folds = Number(row.value[FOLD_CODE].value || 0);
      row.value[WEIGHT_PER_FOLD].value = 20;
      row.value[TOTAL_WEIGHT].value = folds * 20;
      sumFolds += folds;
    });

    // บังคับ remainFold ≥ 0
    record[REMAIN_FOLD].value = Math.max(totalFoldAll - sumFolds,);
  }

  // Event เปลี่ยนค่าในตาราง → อัปเดต remainFold
  kintone.events.on([
    "app.record.create.change." + FOLD_CODE,
    "app.record.edit.change." + FOLD_CODE
  ], function(event) {
    updateRemainFold(event.record);
    return event;
  });

  // Event ก่อนบันทึก → ตรวจสอบและบังคับค่า remainFold
  kintone.events.on([
    "app.record.create.submit",
    "app.record.edit.submit"
  ], function(event) {
    updateRemainFold(event.record);

    var record = event.record;
    var totalFoldAll = Number(record[TOTAL_FOLD_ALL].value || 0);
    var sumFolds = 0;
    record[TABLE_CODE].value.forEach(function(row) {
      sumFolds += Number(row.value[FOLD_CODE].value || 0);
    });

    if (sumFolds > totalFoldAll) {
      event.error = "จำนวนทอพับรวมเกินจำนวนพับทั้งหมด (" + totalFoldAll + ") กรุณาแก้ไขก่อนบันทึก";
      return event;
    }

    return event;
  });

})();



// (function() {
//   "use strict";

//   // ฟิลด์โค้ด (ต้องเปลี่ยนตามฟิลด์จริงในแอปของคุณ)
//   var TABLE_CODE = "Table_MC_Q";         // โค้ดของตาราง
//   var FOLD_CODE = "F_number";       // ฟิลด์ "ทอพับ"
//   var WEIGHT_PER_FOLD = "weightPerFold_1";   // ฟิลด์ "น้ำหนักต่อพับ"
//   var TOTAL_WEIGHT = "weight_results_1";       // ฟิลด์ "น้ำหนักรวม"

//   var TOTAL_FOLD_ALL = "totalFoldAll";       // ฟิลด์ "จำนวนพับทั้งหมด (lookup)"
//   var REMAIN_FOLD = "remainFold";            // ฟิลด์ "จำนวนพับคงเหลือ" (คุณต้องสร้างฟิลด์เพิ่ม)

//   // Event เมื่อเปลี่ยนค่าในฟิลด์ "ทอพับ"
//   kintone.events.on([
//     "app.record.create.change." + FOLD_CODE,
//     "app.record.edit.change." + FOLD_CODE
//   ], function(event) {
//     var record = event.record;

//     var sumFolds = 0;

//     // วน loop ในตาราง
//     record[TABLE_CODE].value.forEach(function(row) {
//       var folds = Number(row.value[FOLD_CODE].value || 0);

//       // กำหนดค่าน้ำหนักต่อพับเป็น 20 ตายตัว
//       row.value[WEIGHT_PER_FOLD].value = 20;

//       // คำนวณน้ำหนักรวม
//       row.value[TOTAL_WEIGHT].value = folds * 20;

//       // รวมจำนวนพับ
//       sumFolds += folds;
//     });

//     // จำนวนพับทั้งหมดจาก Lookup
//     var totalFoldAll = Number(record[TOTAL_FOLD_ALL].value || 0);

//     // คำนวณจำนวนพับคงเหลือ
//     var remain = totalFoldAll - sumFolds;

//     // เซ็ตค่าให้ฟิลด์คงเหลือ
//     record[REMAIN_FOLD].value = remain;

//     return event;
//     });


//     // Event show → Lock ฟิลด์ remainFold และเช็คค่า remainFold = 0
//   kintone.events.on([
//     "app.record.create.show",
//     "app.record.edit.show",
//     "app.record.edit.change." + REMAIN_FOLD
//   ], function(event) {
//     var record = event.record;

//     setTimeout(function() {
//       // Lock remainFold เสมอ
//       var remainInput = kintone.app.record.getFieldElement(REMAIN_FOLD);
//       if (remainInput) {
//         remainInput.querySelector("input").setAttribute("readonly", true);
//         remainInput.querySelector("input").style.backgroundColor = "#f0f0f0";
//       }

//       // ถ้า remainFold = 0 → lock ฟิลด์ทอพับทั้งหมด
//       if (Number(record[REMAIN_FOLD].value) <= 0) {
//         record[TABLE_CODE].value.forEach(function(row) {
//           var foldInput = kintone.app.record.getFieldElement(FOLD_CODE + "_" + row.id);
//           if (foldInput) {
//             foldInput.querySelector("input").setAttribute("readonly", true);
//             foldInput.querySelector("input").style.backgroundColor = "#f0f0f0";
//           }
//         });
//       }
//     }, 500);

//     return event;
//   });



// })();


// (function() {
//   "use strict";

//   var TABLE_CODE = "Table_MC_Q";         
//   var FOLD_CODE = "F_number";       
//   var WEIGHT_PER_FOLD = "weightPerFold_1";   
//   var TOTAL_WEIGHT = "weight_results_1";       

//   var TOTAL_FOLD_ALL = "totalFoldAll";       
//   var REMAIN_FOLD = "remainFold";            

//   // Event เมื่อเปลี่ยนค่าในฟิลด์ "ทอพับ"
//   kintone.events.on([
//     "app.record.create.change." + FOLD_CODE,
//     "app.record.edit.change." + FOLD_CODE
//   ], function(event) {
//     var record = event.record;

//     var sumFolds = 0;

//     record[TABLE_CODE].value.forEach(function(row) {
//       var folds = Number(row.value[FOLD_CODE].value || 0);
//       row.value[WEIGHT_PER_FOLD].value = 20;
//       row.value[TOTAL_WEIGHT].value = folds * 20;
//       sumFolds += folds;
//     });

//     var totalFoldAll = Number(record[TOTAL_FOLD_ALL].value || 0);

//     // คำนวณ remainFold และไม่ให้ติดลบ
//     var remain = totalFoldAll - sumFolds;
//     // if (remain < 0) remain = 0;

//     record[REMAIN_FOLD].value = remain;

//     return event;
//   });

//   // Event ตรวจสอบก่อนบันทึก → ห้ามทอพับเกินจำนวนคงเหลือ
//   kintone.events.on([
//     "app.record.create.submit",
//     "app.record.edit.submit"
//   ], function(event) {
//     var record = event.record;
//     var totalFoldAll = Number(record[TOTAL_FOLD_ALL].value || 0);
//     var sumFolds = 0;

//     record[TABLE_CODE].value.forEach(function(row) {
//       var folds = Number(row.value[FOLD_CODE].value || 0);
//       sumFolds += folds;
//     });

//     if (sumFolds > totalFoldAll) {
//       event.error = "จำนวนทอพับรวมเกินจำนวนพับทั้งหมด (" + totalFoldAll + ") กรุณาแก้ไขก่อนบันทึก";
//       return event;
//     }

//     return event;
//   });

// })();


// (function() {
//   "use strict";

//   var TABLE_CODE = "Table_MC_Q";         
//   var FOLD_CODE = "F_number";       
//   var WEIGHT_PER_FOLD = "weightPerFold_1";   
//   var TOTAL_WEIGHT = "weight_results_1";       

//   var TOTAL_FOLD_ALL = "totalFoldAll";       
//   var REMAIN_FOLD = "remainFold";            

//   // Event เมื่อเปลี่ยนค่าในฟิลด์ "ทอพับ" → คำนวณน้ำหนักต่อแถว
//   kintone.events.on([
//     "app.record.create.change." + FOLD_CODE,
//     "app.record.edit.change." + FOLD_CODE
//   ], function(event) {
//     var record = event.record;

//     record[TABLE_CODE].value.forEach(function(row) {
//       var folds = Number(row.value[FOLD_CODE].value || 0);
//       row.value[WEIGHT_PER_FOLD].value = 20;
//       row.value[TOTAL_WEIGHT].value = folds * 20;
//     });

//     return event;
//   });

//   // Event ก่อนบันทึก → คำนวณ remainFold ใหม่เสมอ และไม่ให้ค่าติดลบ
//   kintone.events.on([
//     "app.record.create.submit",
//     "app.record.edit.submit"
//   ], function(event) {
//     var record = event.record;
//     var totalFoldAll = Number(record[TOTAL_FOLD_ALL].value || 0);
//     var sumFolds = 0;

//     // คำนวณจำนวนพับรวม
//     record[TABLE_CODE].value.forEach(function(row) {
//       var folds = Number(row.value[FOLD_CODE].value || 0);
//       sumFolds += folds;
//     });

//     // บังคับตั้งค่า remainFold = totalFoldAll - sumFolds ≥ 0
//     record[REMAIN_FOLD].value = Math.max(totalFoldAll - sumFolds, 0);

//     // ตรวจสอบไม่ให้ทอพับรวมเกินจำนวนทั้งหมด
//     if (sumFolds > totalFoldAll) {
//       event.error = "จำนวนทอพับรวมเกินจำนวนพับทั้งหมด (" + totalFoldAll + ") กรุณาแก้ไขก่อนบันทึก";
//       return event;
//     }

//     return event;
//   });

// })();
