(function () {
  'use strict';

  console.log("✅ Script loaded!");

  // Generate rows for the subtable
  function generateRows(amount, machineId) {
    var rows = [];
    var today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    for (var i = 1; i <= amount; i++) {
      var row = {
        value: {
          Date: { type: "DATE", value: today },             // Default date
          Number_0: { type: "NUMBER", value: "" },          // Empty number
          Number_1: { type: "NUMBER", value: "" },          // Empty number
          Time: { type: "TIME", value: "" },                // Empty time
          Time_0: { type: "TIME", value: "" },
          Time_1: { type: "TIME", value: "" },
          Time_2: { type: "TIME", value: "" },
          User_selection: { type: "USER_SELECT", value: [] }, // No user selected
          fold_no: { type: "SINGLE_LINE_TEXT", value: machineId + "-" + i } // Main field
        }
      };
      rows.push(row);
    }
    return rows;
  }

  // Update the subtable based on Amount + MachineID
  function updateTable(record) {
    var amount = Number(record.amount.value) || 0;
    var machineId = record.MachineID.value || ""; // เครื่องทอ

    console.log("Amount:", amount, "MachineID:", machineId);

    if (!machineId || amount <= 0) {
      console.warn("⚠️ Missing MachineID or Amount. Clearing table.");
      record.weavingTable_2.value = [];
      return record;
    }

    record.weavingTable_2.value = generateRows(amount, machineId);
    console.log("Final weavingTable_2:", record.weavingTable_2.value);
    return record;
  }

  // On create/edit page load
  kintone.events.on(
    ['app.record.create.show', 'app.record.edit.show'],
    function (event) {
      console.log("Event fired: create/edit show");
      event.record = updateTable(event.record);
      return event;
    }
  );

  // On Amount or MachineID change
  kintone.events.on(
    [
      'app.record.create.change.amount',
      'app.record.edit.change.amount',
      'app.record.create.change.MachineID',
      'app.record.edit.change.MachineID'
    ],
    function (event) {
      console.log("Event fired: amount/MachineID changed");
      event.record = updateTable(event.record);
      return event;
    }
  );

})();
