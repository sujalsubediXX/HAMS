import React from "react";
import Slider from "react-slick";
import slider1 from "/slider1.jpg";
import slider2 from "/slider2.jpg";
import slider4 from "/slider4.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SliderImage() {
  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, 
  };
  
  return (
    <div className="slider-container w-full max-w-screen-xl mx-auto px-2 ">
      <Slider {...settings}>
        {[slider1, slider2,  slider4].map((img, index) => (
          <div key={index}>
            <div className="w-full h-[50vh] md:h-[80vh] my-2">
              <img
                src={img}
                alt={`slide-${index + 1}`}
                className="w-full h-full object-cover "
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SliderImage;
