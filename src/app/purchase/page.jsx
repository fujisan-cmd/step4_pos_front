'use client';
import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from '@zxing/library';
import { ToastContainer } from "react-toastify";
import fetchItem from "./fetchItem";
import fetchAllItems from "./fetchAllItems";
import popup from "./popup";

export default function Page(){
    const [id, setID] = useState('');
    const [scannedCode, setScannedCode] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [ItemList, setItemList] = useState([]);
    const [JsonBody, setJsonBody] = useState([]);

    const videoRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false); // カメラが起動しているかを判定するフラグ

    const startScan = async () => {
        if (isScanning) return; // カメラの2重起動防止

        setIsScanning(true);
        const reader = new BrowserMultiFormatReader();

        try{
            /* 
                decodeFromVideoDevice( camera, display, callback )
                    camera: 使用するカメラ、nullなら自動で割り当て
                    display: 画像を表示する場所
                    callback: 読み取りが成功/失敗したときの動作を記述
            */
            await reader.decodeFromVideoDevice(null, videoRef.current, async (result, error) => {
                if (result) {                         // 読み取りが成功したらresultが返る
                    const code = result.getText();
                    setScannedCode(code);

                    reader.reset(); // カメラを終了する
                    setIsScanning(false);

                    // ここから商品DB検索
                    const itemData = await fetchItem(code);
                    if (itemData.error) {
                        setName('該当する商品がありません');
                        setPrice('');
                        return;
                    }

                    setID(itemData.product_id);
                    setName(itemData.name);
                    setPrice(itemData.price);
                    // ここまで商品DB検索
                }
            });
        } catch (err){
            console.error('カメラの使用中にエラー:', err);
            setIsScanning(false);
        }
    };

    const handleRead = () => {
        const fetchAndSetItem = async () => {
            const itemData = await fetchItem(scannedCode);
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
        if (name === '該当する商品がありません' || price === ''){
            return; // 不正な入力の場合は処理を実行しない
        }

        // 画面に表示するデータ
        const newItem = `${name} x1 ${price}円 ${price}円`;
        setItemList([...ItemList, newItem]);

        // APIに渡すデータ
        const newRecord = {
            product_id: id,
            barcode: scannedCode,
            product_name: name,
            price: price
        };
        const newJsonBody = [...JsonBody, newRecord];
        setJsonBody(newJsonBody);
        console.log("next JsonBody:", newJsonBody);

        // コード、名称、価格は空欄にする
        setID('');
        setScannedCode('');
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

            popup(result.total_with_tax, result.total_wo_tax);
        };
        submitAllItems();
        setItemList([]);
        setJsonBody([]);
    };

    return (
        <>
        <ToastContainer></ToastContainer>
        <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto p-4 border rounded-xl shadow-md bg-white w-full">
            <button onClick={startScan} className="w-full bg-blue-200 hover:bg-blue-300 font-bold py-2 px-4 rounded mb-4">
                スキャン（カメラ）
            </button>
            <div>
                <video ref={videoRef}/>
            </div>

            <button onClick={handleRead} className="w-full bg-blue-200 hover:bg-blue-300 font-bold py-2 px-4 rounded mb-4">
                バーコード読み込み(カメラが使えないとき)
            </button>

            <input
                type="text"
                placeholder="12345678901"
                value={scannedCode} 
                onChange={(e)=> setScannedCode(e.target.value)}
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