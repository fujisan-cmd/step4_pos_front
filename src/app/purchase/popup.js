import { Slide, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './ToastStyle.css';

export default function popup(total_with_tax, total_wo_tax){
    console.log("This is react-toastify");
    toast(
        <div className="custom-toast">
            <p className="toast-message">
                合計: {total_with_tax.toLocaleString()}円 (税抜価格 {total_wo_tax.toLocaleString()}円)
            </p>
            <button onClick={()=>{toast.dismiss()}} className="toast-button">
                OK
            </button>
        </div>,
        {
            className: 'toast-container',
            autoClose: false,
            closeOnClick: false,
            transition: null
        }
    );
}