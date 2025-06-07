import { Slide, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './ToastStyle.css';

export default function popup(){
    console.log("This is react-toastify");
    toast(
        <div className="custom-toast">
            <p className="toast-message">Hello, toast!!</p>
            <button onClick={()=>{toast.dismiss()}} className="toast-button">
                OK
            </button>
        </div>,
        {
            className: 'toast-container',
            autoClose: false,
            closeOnClick: false,
            transition: Slide
        }
    );
}