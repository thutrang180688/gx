import React, { useState } from 'react';
import { User, ClassSession } from '../../types';

interface Props {
  user: User | null;
  session: ClassSession;
  onSubmit: (rating: any) => void;
}

const RatingSystem: React.FC<Props> = ({ user, session, onSubmit }) => {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-inner mt-4">
      <p className="text-[10px] font-black text-teal-900 uppercase mb-4 text-center">Đánh giá chất lượng lớp học</p>
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onClick={() => setStars(s)} className={`text-2xl ${s <= stars ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
        ))}
      </div>
      <textarea 
        placeholder="Cảm nhận của bạn về buổi tập..."
        className="w-full p-4 bg-slate-50 rounded-2xl text-xs border-0 h-24 mb-4"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button 
        onClick={() => {
          onSubmit({
            userEmail: user.email,
            userName: user.name,
            instructor: session.instructor,
            rating: stars,
            comment,
            createdAt: new Date().toLocaleString()
          });
          setComment('');
        }}
        className="w-full bg-teal-600 text-white py-3 rounded-xl font-black text-[10px] uppercase"
      >
        Gửi đánh giá
      </button>
    </div>
  );
};

export default RatingSystem;