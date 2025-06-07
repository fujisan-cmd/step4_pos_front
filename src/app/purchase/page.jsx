'use client';
import { useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import fetchItem from "./fetchItem";
import fetchAllItems from "./fetchAllItems";
import popup from "./popup";

export default function Page(){
    const [id, setID] = useState('');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [ItemList, setItemList] = useState([]);
    const [JsonBody, setJsonBody] = useState([]);

    const handleRead = () => {
        const fetchAndSetItem = async () => {
            const itemData = await fetchItem(code);
            // 例外処理
            if (itemData.error){
                setName('該当する商品がありません');
                setPrice('');
                return
            }

            const item_id = itemData.product_id;
            const item_name = itemData.name;
            const item_price = itemData.price;
            setID(item_id);
            setName(item_name);
            setPrice(item_price);
        };
        fetchAndSetItem();
    };

    const handleAdd = () => {
        // 不正な入力の場合は処理を実行しない
        if (name === '該当する商品がありません' || price === ''){
            return;
        }

        // 画面に表示するデータ
        const newItem = `${name} x1 ${price}円 ${price}円`;
        setItemList([...ItemList, newItem]);

        // APIに渡すデータ
        const newRecord = {
            product_id: id,
            barcode: code,
            product_name: name,
            price: price
        };
        const newJsonBody = [...JsonBody, newRecord];
        setJsonBody(newJsonBody);
        console.log("next JsonBody:", newJsonBody);

        // コード、名称、価格は空欄にする
        setID('');
        setCode('');
        setName('');
        setPrice('');
    };

    const handleSubmit = () => {
        const submitAllItems = async () => {
            const requestBody = {
                employee_id: "9999999999",
                store_id: "30",
                pos_id: "90",
                items: JsonBody
            }
            const result = await fetchAllItems(requestBody);
            console.log(result);
            console.log('successfully submitted!');
        };
        submitAllItems();
        popup();
        setItemList([]);
        setJsonBody([]);
    };

    return (
        <>
        <ToastContainer></ToastContainer>
        <div className="max-w-md mx-auto p-4 border rounded-xl shadow-md bg-white sm:w-full">
            <button className="w-full bg-blue-200 hover:bg-blue-300 font-bold py-2 px-4 rounded mb-4">
                スキャン（カメラ）
            </button>
            <button onClick={handleRead} className="w-full bg-blue-200 hover:bg-blue-300 font-bold py-2 px-4 rounded mb-4">
                バーコード読み込み（手動）
            </button>

            <input
                type="text"
                placeholder="12345678901"
                value={code} 
                onChange={(e)=> setCode(e.target.value)}
                className="w-full border px-3 py-2 mb-2 rounded"
            />
            <input
                type="text"
                placeholder="商品名"
                value={name} readOnly
                className="w-full border px-3 py-2 mb-2 rounded"
            />
            <input
                type="text"
                placeholder="価格(税抜)"
                value={price} readOnly
                className="w-full border px-3 py-2 mb-4 rounded"
            />

            <button onClick={handleAdd} className="w-full bg-blue-200 hover:bg-blue-300 font-bold py-2 px-4 rounded mb-4">
                追加
            </button>

            <div className="border p-2 mb-4 rounded bg-gray-50">
                <p className="font-bold mb-2">購入リスト</p>
                {ItemList.map(
                    (item, index) => (
                        <p key={index}>{item}</p>
                    )
                )}
            </div>

            <button onClick={handleSubmit} className="w-full bg-blue-200 hover:bg-blue-300 font-bold py-2 px-4 rounded">
                購入
            </button>
        </div>
        </>
    )
}