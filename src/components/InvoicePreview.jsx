import { forwardRef } from "react";
import { formatInvoiceData } from "../util/formateInvoice";
import {templateComponents} from "../util/InvoiceTemplates"

const InvoicePreview = forwardRef(({invoiceData,template},ref)=>{
    
    const formattedData = formatInvoiceData(invoiceData);
    // console.log(formattedData);
    
    const SelectedTemplate= templateComponents[template] || templateComponents["template1"];

    return (
        <div ref={ref} className="invoice-preview container px-2 py-2 overflow-auto">
            <SelectedTemplate data={formattedData}/>
        </div>
    )
})

export default InvoicePreview; 