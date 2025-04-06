'use client'
import { useState } from "react";

type StarRatingProps = {
  rating: number;
};

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const [currentRating, setCurrentRating] = useState<number>(rating);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const fullStarSvg = (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.9998 3.58867L11.7248 7.07617L12.0123 7.70117L12.6373 7.79492L16.4873 8.35117L13.7498 11.0387L13.2811 11.4949L13.3936 12.1199L14.0498 15.9512L10.6061 14.1449L9.9998 13.8887L9.41855 14.1949L5.9748 15.9762L6.5998 12.1449L6.7123 11.5199L6.2498 11.0387L3.4873 8.31992L7.3373 7.76367L7.9623 7.66992L8.2498 7.04492L9.9998 3.58867Z" fill="#5E3939"/>
      <path d="M9.9998 0.763672L7.15605 6.52617L0.799805 7.44492L5.39981 11.9324L4.3123 18.2637L9.9998 15.2762L15.6873 18.2637L14.5998 11.9324L19.1998 7.45117L12.8436 6.52617L9.9998 0.763672Z" fill="#5E3939"/>
    </svg>
  );

  const halfStarSvg = (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.9998 3.58867L11.7248 7.07617L12.0123 7.70117L12.6373 7.79492L16.4873 8.35117L13.7498 11.0387L13.2811 11.4949L13.3936 12.1199L14.0498 15.9512L10.6061 14.1449L9.9998 13.8887V13.5L10 12L9.9998 11.0387L10 10V9L9.9998 8V7.07617V3.58867ZM9.9998 0.763672L7.15605 6.52617L0.799805 7.44492L5.39981 11.9324L4.3123 18.2637L9.9998 15.2762L15.6873 18.2637L14.5998 11.9324L19.1998 7.45117L12.8436 6.52617L9.9998 0.763672Z" fill="#5E3939"/>
    </svg>
  );

  const emptyStarSvg = (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.9998 3.58867L11.7248 7.07617L12.0123 7.70117L12.6373 7.79492L16.4873 8.35117L13.7498 11.0387L13.2811 11.4949L13.3936 12.1199L14.0498 15.9512L10.6061 14.1449L9.9998 13.8887L9.41855 14.1949L5.9748 15.9762L6.5998 12.1449L6.7123 11.5199L6.2498 11.0387L3.4873 8.31992L7.3373 7.76367L7.9623 7.66992L8.2498 7.04492L9.9998 3.58867ZM9.9998 0.763672L7.15605 6.52617L0.799805 7.44492L5.39981 11.9324L4.3123 18.2637L9.9998 15.2762L15.6873 18.2637L14.5998 11.9324L19.1998 7.45117L12.8436 6.52617L9.9998 0.763672Z" fill="#5E3939"/>
    </svg>
  );

  return (
    <div className="flex items-center self-center">
      {[...Array(fullStars)].map((_, index) => (
        <div key={`full-${index}`} className="w-6 h-6">
          {fullStarSvg}
        </div>
      ))}
      {hasHalfStar && (
        <div className="w-6 h-6">
          {halfStarSvg}
        </div>
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <div key={`empty-${index}`} className="w-6 h-6">
          {emptyStarSvg}
        </div>
      ))}
      <span className="ml-[12px] text-[20px] font-light text-stars-color">{currentRating}</span>
    </div>
  );
};

export default StarRating;