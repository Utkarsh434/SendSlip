import { useContext, useEffect, useState } from "react"
import { AppContext, initialInvoiceData } from "../context/AppContext";
import { getAllInvoices } from "../service/InvoiceService";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { formateDate } from "../util/formateInvoice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const DashBoard = () => {
  
  const[invoices,setInvoices] = useState([]);
  const {baseURL,setInvoiceData,
    setInvoiceTitle,
    setSelectedTemplate} = useContext(AppContext);

  const navigate = useNavigate();
  const {getToken} = useAuth();

  useEffect(()=>{
    const fetchInvoice = async()=>{
      try {
      const token = await getToken();

        const response =  await getAllInvoices(baseURL,token);
        setInvoices(response.data);
      } catch (error) {
        toast.error('Faild to load the invoices',error.message);
      }
    }
    fetchInvoice();
  },[baseURL]) ; 


  const handleViewClick= (invoice)=>{
    setInvoiceData(invoice);
    setSelectedTemplate(invoice.template || 'template1');
    setInvoiceTitle(invoice.title || "New Invoice");
    navigate('/preview');
  }

  const handleCreateNew = ()=>{
    //reset to inital state from context
    setInvoiceTitle("New Invoice");
    setSelectedTemplate("template1");
    setInvoiceData(initialInvoiceData);
    navigate('/generate');
  }

  return (
    <div className="container py-5">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
        {/* Create Nen Invoice Card */}
        <div className="col">
          <div onClick={handleCreateNew} className="card h-100 d-flex justify-content-center align-items-center border border-2  border-light shadow-sm cursor--pointer" style={{maxHeight:'270px'}}>
            <Plus size={48}/>
            <p className="mt-3 fw-medium">Create New Invoice</p>
          </div>
        </div>

        {/* Render the existing invoices */}
        {
          invoices.map((invoice,idx)=>(
            <div key={idx} className="col">
              <div className="card h-100 shadow-sm cursor-pointer" style={{minHeight:"270px"}} onClick={()=>handleViewClick(invoice)}>
                {invoice.thumbnailUrl && (
                  <img src={invoice.thumbnailUrl} alt="invoice thumbnail" className="card-img-top" style={{height:"200px", objectFit:"cover"}} />
                )}
                <div className="card-body"> 
                  <h6 className="card-title mb-1">
                    {invoice.title}
                  </h6>
                  <small className="text-muted">
                    Last Updated :{formateDate(invoice.lastUpdatedAt)};
                  </small>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DashBoard
