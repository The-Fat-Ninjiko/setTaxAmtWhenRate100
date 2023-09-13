/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 *
 * SuiteScript to set TAX AMT to the line item amount if the tax rate is 100%.
 *
 * This script should be deployed as a User Event script on Vendor Bills and Customer Invoices.
 * It will trigger on the 'beforeSubmit' event.
 */
define([], 

function() {
    function beforeSubmit(context) {
        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            var newRecord = context.newRecord;
            var lineCount = newRecord.getLineCount({ sublistId: 'item' }); // Get line items are on 'item' sublist
            var subListID = 'item'; //set the defualt sublist id to itemline

            log.debug({
                title: "lineCount: ",
                details: lineCount
            });

            log.debug({
                title: "subListID: ",
                details: subListID
            });
            
            if (lineCount == 0) //if the count is equal zero means that the work will be on the expenses tap
            {
                lineCount = newRecord.getLineCount({ sublistId: 'expense' }); // Get line expense are on 'expense' sublist
                subListID = 'expense'
            }

            log.debug({
                title: "lineCount: ",
                details: lineCount
            });

            log.debug({
                title: "subListID: ",
                details: subListID
            });
            

            for (var i = 0; i < lineCount; i++) {
                var taxRate = newRecord.getSublistValue({
                    sublistId: subListID,
                    fieldId: 'taxrate1', // Replace with your tax rate field ID
                    line: i
                    });

                log.debug({
                    title: "Tax rate: ",
                    details: taxRate
                });

                if (taxRate === 100) {
                    var lineAmount = newRecord.getSublistValue({
                        sublistId: subListID,
                        fieldId: 'amount', // Replace with your line item amount field ID
                        line: i
                    });

                    log.debug({
                        title: "lineAmount: ",
                        details: lineAmount
                    });
                
                    newRecord.setSublistValue({
                        sublistId: subListID,
                        fieldId: 'tax1amt', // Replace with your tax amount field ID
                        line: i,
                        value: lineAmount
                    });

                    newRecord.setSublistValue({
                        sublistId: subListID,
                        fieldId: 'amount', // set the line amount to zero
                        line: i,
                        value: 0
                    });
                }
            }
            
        }
      }
      
    
    return {
        beforeSubmit : beforeSubmit
    };
});

  // Make sure to deploy this script on Vendor Bills and Customer Invoices with the appropriate event and filters.
  