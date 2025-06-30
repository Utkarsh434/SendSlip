import { useContext, useEffect, useRef, useState } from "react";
import { templates } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import InvoicePreview from "../components/InvoicePreview";
import { deleteInvoice, saveInvoice, sendInvoice } from "../service/InvoiceService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { uploadInvoiceThumbnail } from "../service/cloudinaryService";
import { generatePdfFromElement } from "../util/pdfutil";
import { useAuth, useUser } from "@clerk/clerk-react";


const PreviewPage = () => {
  const previewRef = useRef();
  const { invoiceData, selectedTemplate, setSelectedTemplate, baseURL } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [customerEmail , setCustomerEmail] = useState("");
  const [emailing,setEmailing] = useState(false);
  const {getToken} = useAuth();
  const {user} = useUser();


  const handleSendEmail = async()=>{
    if(!previewRef.current || !customerEmail){
      return toast.error("please enter a valid email and try again");
    }

    try {
      setEmailing(true);
      const  pdfBlob = await generatePdfFromElement(previewRef.current,`invoice_${Date.now()}.pdf`,true);

      const formData = new FormData();
      formData.append("file",pdfBlob);
      formData.append("email",customerEmail);
      const token = await getToken();
      const response = await sendInvoice(baseURL,formData,token);
      console.log(response);
      
      if(response.status===200){
        toast.success("Email send Successfully.");
        setShowModel(false);
        setCustomerEmail("");
      }else{
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("Failed to send email",error.message);
    }finally{
      setEmailing(false);
    }
  }



  const handleSaveAndExit = async () => {
    try {
      setLoading(true);

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        scrollY: -window.scrollY,
      });
      const imageData = canvas.toDataURL("image/png");
      const thumbnailUrl = await uploadInvoiceThumbnail(imageData);
      const payload = {
        ...invoiceData,
        clerkId:user.id,
        thumbnailUrl,
        template: selectedTemplate,
      };

      const token = await getToken();
      const response = await saveInvoice(baseURL, payload,token);
      if (response.status === 200) {
        toast.success("Invoice saved successfully.");
        navigate("/dashboard");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save the invoice", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      const response = await deleteInvoice(baseURL, invoiceData.id,token);
      if (response.status === 204) {
        toast.success("Invoice deleted Successfully.");
        navigate("/dashboard");
      } else {
        toast.error("Unable to delete invoice.");
      }
    } catch (error) {
      toast.error("Failed to delete the invoice", error.message);
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;

    try {
      setDownloading(true);
      await generatePdfFromElement(
        previewRef.current,
        `invoice_${Date.now()}.pdf`
      );
    } catch (error) {
      toast.error("Failed to generate invoice", error.message);
    } finally {
      setDownloading(false);
    }
  };


  // useEffect(()=>{
  //   if(!invoiceData || !invoiceData.item?.length){
  //     toast.error("Invoice data is empty");
  //     navigate("/dashboard");
  //   }
  // },[invoiceData,navigate]);

  return (
    <div className="previewpage container-fluid d-flex flex-column p-3 min-vh-100">
      {/* Action buttons */}
      <div className="flex flex-col align-items-center mb-4 gap-3">
        {/* List of template button */}
        <div className="d-flex gap-2 flex-wrap mb-3 justify-content-center">
          {templates.map(({ id, label }) => (
            <button
              key={id}
              style={{ minWidth: "100px", height: "38px" }}
              onClick={() => setSelectedTemplate(id)}
              className={`btn btn-sm rounded-pill p-2 ${
                selectedTemplate === id
                  ? "btn-warning"
                  : "btn-outline-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List of action buttons */}
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center"
            onClick={handleSaveAndExit}
            disabled={loading}
          >
            {loading && <Loader2 className="me-2 spin-animation" size={18} />}
            {loading ? "Saving..." : "Save And Exit"}
          </button>
          {invoiceData.id && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Invoice
            </button>
          )}
          <button className="btn btn-secondary" onClick={()=>navigate("/dashboard")}>Back to Dashboard</button>
          <button className="btn btn-info" onClick={() => setShowModel(true)}>
            Send Email
          </button>
          <button
            className="btn btn-success d-flex align-items-center justify-content-center"
            disabled={downloading}
            onClick={handleDownloadPdf}
          >
            {downloading && (
              <Loader2 className="me-2 spin-animation" size={18} />
            )}
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Display the invoice preview */}
      <div className="flex-grow-1 overflow-auto d-flex justify-content-center align-items-start bg-light py-3">
        <div ref={previewRef} className="invoice-preview">
          <InvoicePreview
            invoiceData={invoiceData}
            template={selectedTemplate}
          />
        </div>
      </div>

      {showModel && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Invoice</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModel(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Customer email"
                  onChange={(e)=>setCustomerEmail(e.target.value)}
                  value={customerEmail}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSendEmail} disabled={emailing}>
                  {emailing && (
                    <Loader2 size={18}/>
                  )}
                  {emailing?"Sending...":"Send"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModel(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
