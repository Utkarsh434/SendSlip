import { Pencil } from "lucide-react";
import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext";
import InvoiceForm from "../components/InvoiceForm";
import TemplateGrid from "../components/TemplateGrid";
import 'react-hot-toast'
import toast from "react-hot-toast";
import {useNavigate} from 'react-router-dom'
const MainPage = () => {

  const [isEditingTitle , setIsEditingTitle] = useState(false);
  const navigate = useNavigate();

  const {invoiceTitle , 
    setInvoiceTitle , 
    setInvoiceData , 
    invoiceData,
    setSelectedTemplate} = useContext(AppContext);


  const handleTemplateClick = (templeteId)=>{
    console.log(invoiceData);
    
    const hasInvalidItem = invoiceData.items.some(
      (item)=>!item.qty || !item.amount
    );
    if(hasInvalidItem){
      toast.error("Please enter quantity and amount for all items.")
      return ;
    }
    setSelectedTemplate(templeteId);

    navigate('/preview');

  }


  const handleTitleChange = (e)=>{
    const newTitle = e.target.value;
    setInvoiceTitle(newTitle);
    setInvoiceData((prev)=>({
      ...prev,
      title:newTitle,
    }))
  }

  const handleTitleEdit = () =>{
    setIsEditingTitle(true);
  }

  const handleTitleBlur = ()=>{
    setIsEditingTitle(false);
  }

  return (
    <div className="mainpage container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* title bar */}
        <div className="bg-white border rounded shadow-sm p-3 mb-4">
            <div className="d-flex align-items-center">
              {isEditingTitle?(
                <input  type="text" className="form-control me-2" autoFocus
                onBlur={handleTitleBlur}
                onChange={handleTitleChange}
                value={invoiceTitle}
                />
              ):(
                <>
                  <h5 className="mb-0 me-2">
                    {invoiceTitle}
                  </h5>
                  <button className="btn btn-sm p-0 border-0 bg-transparent" 
                  onClick={handleTitleEdit} 
                  >
                    <Pencil className="text-primary" size={20}/>
                  </button>
                </>
              )}
            </div>
        </div>

        {/* Invoice form and template grid */}
        <div className="row g-4 align-item-stretch">
          {/* invoice form */}
          <div className="col-12 col-lg-6 d-flex">  
            <div className="bg-white border rounded shadow-sm p-4 w-100">
                <InvoiceForm/>
            </div>
          </div>

          {/* template grid */}
          <div className="col-12 col-lg-6 d-flex">  
            <div className="bg-white border rounded shadow-sm p-4 w-100">
              <TemplateGrid onTemplateClick={handleTemplateClick}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
