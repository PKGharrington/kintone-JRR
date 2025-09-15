(function() {
  "use strict";

  // -------------------------------
  // CONFIG: change these values
  // -------------------------------
  var ITEM_APP_ID = 53;   // Product Master Data app ID
  var SUBDOMAIN   = "z0j2a1yk5nej"; // your Kintone subdomain

  var PROD_ORDER_APP_ID = 32;

  // Field codes in the Sales Order app
  var TABLE_CODE     = "product_table";        
  var PRODUCT_CODE   = "product_code";         
  var PRODUCT_DESC   = "product_description";  
  var PRODUCT_LINK   = "product_link";      

  // Field codes in the Product Master app
  var MASTER_ID      = "product_id";           
  var MASTER_DESC    = "product_description";  

  // -------------------------------
  // Helper: Fetch product info
  // -------------------------------
  function fetchProduct(code, callback) {
    console.log("[DEBUG] Fetching product for code:", code);
    if (!code) return callback(null);

    var query = MASTER_ID + ' = "' + code + '"';
    var params = { app: ITEM_APP_ID, query: query };

    kintone.api('/k/v1/records', 'GET', params).then(function(resp) {
      console.log("[DEBUG] API response:", resp);
      callback(resp.records.length > 0 ? resp.records[0] : null);
    }).catch(function(err) {
      console.error("[DEBUG] API error:", err);
      callback(null);
    });
  }

  // -------------------------------
  // Event: when product_code changes in table
  // -------------------------------
  kintone.events.on(
    [
      "app.record.create.change." + PRODUCT_CODE,
      "app.record.edit.change." + PRODUCT_CODE
    ],
    function(event) {
      console.log("[DEBUG] Product Code field changed");

      var changedRow = event.changes.row;
      var code = changedRow.value[PRODUCT_CODE].value;
      console.log("[DEBUG] Changed row code:", code);

      fetchProduct(code, function(item) {
        if (item) {
          console.log("[DEBUG] Product found:", item);

          var rows = event.record[TABLE_CODE].value;

          rows.forEach(function(row) {
            if (row.id === changedRow.id) {
              // ✅ Write description
              if (MASTER_DESC in item && PRODUCT_DESC in row.value) {
                row.value[PRODUCT_DESC].value = item[MASTER_DESC].value;
                console.log("[DEBUG] Wrote description:", item[MASTER_DESC].value);
              }

              // ✅ Write hyperlink
              if (PRODUCT_LINK in row.value && "$id" in item) {
                var recId = item.$id.value;
                var url = "https://" + SUBDOMAIN + ".cybozu.com/k/" + ITEM_APP_ID + "/show#record=" + recId;
                row.value[PRODUCT_LINK].value = url;
                console.log("[DEBUG] Wrote link:", url);
              }
            }
          });

        } else {
          console.log("[DEBUG] No product found for:", code);

          var rows = event.record[TABLE_CODE].value;
          rows.forEach(function(row) {
            if (row.id === changedRow.id) {
              if (PRODUCT_DESC in row.value) row.value[PRODUCT_DESC].value = "";
              if (PRODUCT_LINK in row.value) row.value[PRODUCT_LINK].value = "";
            }
          });
        }
      });

      return event;
    }
  );
  // -------------------------------
  // Event: Add Button to Header
  // -------------------------------
  kintone.events.on(["app.record.detail.show"], function(event) {
    // ลบปุ่มเดิมถ้ามี (ป้องกันซ้ำ)
    if (document.getElementById("goProdOrderBtn")) {
      return;
    }
    if (document.getElementById("goProdOrderBtn")) {
      return;
    }

    // สร้างปุ่ม
    var myButton = document.createElement("button");
    myButton.id = "goProdOrderBtn";
    myButton.innerText = "ไปที่ Production Order";
    myButton.className = "kintoneplugin-button-normal";

    // กดแล้วไปที่ Production Order App
    myButton.onclick = function() {
      var url = "https://" + SUBDOMAIN + ".cybozu.com/k/" + PROD_ORDER_APP_ID + "/";
      window.open(url, "_blank"); // เปิดหน้าใหม่
    };

    // ใส่ปุ่มใน Header Menu
    kintone.app.record.getHeaderMenuSpaceElement().appendChild(myButton);
  });

})();
