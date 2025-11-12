import { useState } from "react";
import { addReview } from "../api/reviews";

export default function ReviewModal({ placeId, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  const submit = async () => {
    const form = new FormData();
    form.append("placeId", placeId);
    form.append("rating", rating);
    form.append("comment", comment);
    [...files].forEach(f => form.append("photos", f));
    await addReview(form);
    onClose(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0D1117] p-5 rounded-2xl w-96 shadow">
        <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
        <label className="text-xs">Rating</label>
        <input type="number" min="1" max="5" value={rating} onChange={e=>setRating(e.target.value)}
               className="w-full border rounded-md px-2 py-1 mb-2" />
        <textarea className="w-full border rounded-md px-2 py-2 mb-2" rows={3}
                  placeholder="Share your experience..." value={comment} onChange={e=>setComment(e.target.value)} />
        <input type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} />
        <button onClick={submit} className="w-full bg-green-600 text-white py-2 rounded-lg mt-3">Submit</button>
        <button onClick={()=>onClose(false)} className="w-full mt-2 text-gray-500">Cancel</button>
      </div>
    </div>
  );
}