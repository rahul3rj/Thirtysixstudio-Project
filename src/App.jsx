import { useEffect, useState, useRef } from 'react'
import React from 'react'
import Canvas from './Canvas'
import data from "./data"
import LocomotiveScroll from 'locomotive-scroll';
import Toggle from './Toggle';
import Toggle2 from './Toggle2';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const headingref = useRef(null);
  const growingSpan = useRef(null);
  const scrollRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    
    scrollRef.current = new LocomotiveScroll({
      smooth: true,
      multiplier: 1,
      class: 'smooth-scroll'
    });

  
    if (showCanvas) {
      setTimeout(() => {
        scrollRef.current.update();
      }, 500); 
    }

    
    const textElements = document.querySelectorAll('.scroll-trigger-text');
    textElements.forEach((element) => {
      gsap.fromTo(element,
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "bottom bottom", 
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    const headingElements = document.querySelectorAll('.scroll-trigger-heading');
    headingElements.forEach((element) => {
      // Split text into individual characters
      const text = element.textContent;
      element.textContent = '';
      
      // Create spans for each character
      const chars = text.split('').map(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        element.appendChild(span);
        return span;
      });

      // Animate each character
      gsap.fromTo(chars,
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.05, // Delay between each character animation
          scrollTrigger: {
            trigger: element,
            start: "70% 100%",
            end: "70% 100%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      if (scrollRef.current) {
        scrollRef.current.destroy();
      }
    }
  }, [showCanvas])
  
  useGSAP(()=>{
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // Smooth interpolation animation loop
    gsap.ticker.add(() => {
      // Lerp formula with very small increment for ultra smoothness
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      gsap.set(growingSpan.current, {
        top: currentY,
        left: currentX,
        force3D: true,
        smoothOrigin: true
      });
    });

    // Update target positions on mouse move
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Toggle between states on click
    headingref.current.addEventListener('click',(e)=>{
      if (!showCanvas) {
        // Animate to show canvas
        gsap.to(growingSpan.current,{
          duration:1,
          scale:1000,
          ease:"power2.inOut",
          onComplete:()=>{
            gsap.set(growingSpan.current,{
              clearProps:"all",
              scale:0
            })
            gsap.set("body", {
              backgroundColor:"#fd2c2a",
            })
            setShowCanvas(true);
          }
        })
      } else {
        // Animate back to initial state
        gsap.from(growingSpan.current,{
          duration:1,
          scale:10,
          ease:"power2.inOut",
          onComplete:()=>{
            gsap.set("body", {
              backgroundColor:"initial",
            })
            gsap.set(growingSpan.current,{
              clearProps:"all",
              scale:0
            })
            setShowCanvas(false);
          }
        })
      }
    })

  }, [showCanvas])
  

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
  <>
  <span ref={growingSpan} className="growing fixed top-[-20px] left-[-20px] w-5 h-5 rounded-full"><h5 className='text-red-500 w-[20vh] text-center'>CLICK FOR SOUND</h5></span>
  <div className={`w-full h-screen relative ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
    <nav className={`top-0 left-0 w-full border-b-[1px] ${darkMode ? 'border-white bg-black' : 'border-black bg-transparent'} shadow-sm z-[2]`}>
      <div className="max-w-9xl mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            <h1 className={`text-sl font-normal z-[2] ${darkMode ? 'text-white' : 'text-gray-800'}`}>Thirtysixstudio</h1>
          </div>
          
            <div className="relative inline-flex items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-16 h-8 rounded-full z-[2] ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'} relative transition-all duration-500 focus:outline-none shadow-inner hover:shadow-lg`}
              >
                <div 
                  className={`absolute top-0.5 w-7 h-7 rounded-full shadow-md transform transition-all duration-500 z-[2]
                    ${darkMode ? 
                      'translate-x-[2.25rem] bg-zinc-100' : 
                      'translate-x-0.5 bg-white'
                    }
                    flex items-center justify-center
                  `}
                >
                  {!darkMode ? (
                    <svg 
                      className="w-4 h-4 text-black z-[2]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/>
                    </svg>
                  ) : (
                    <svg 
                      className="w-4 h-4 text-black z-[2]" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                    </svg>
                  )}
                </div>
              </button>
            </div>

          <div className="h-full flex items-center mr-[15%]">
            {["What we do", "Who we are", "How we give back", "Talk to us"].map((link, index) => (
              <a 
                key={index}
                href={`#${link.toLowerCase()}`}
                className={`mx-4 h-full flex items-center z-[2] ${darkMode ? 'text-white' : 'text-black'} relative after:absolute after:bottom-0 after:right-0 after:h-[1px] after:w-0 hover:after:w-full ${darkMode ? 'after:bg-white' : 'after:bg-black'} hover:after:left-0 after:right-full after:transition-all after:duration-300`}
              >
                {link}
              </a>
            ))}
            
          </div>
        </div>
      </div>
    </nav>
    <div className='w-[100%] h-[50%] relative z-[1]'>
      <div className='w-[25%] h-[50%] absolute top-24 left-[25%]'>
        <h1 id='text' className={`text-4xl z-[2] scroll-trigger-text ${darkMode ? 'text-white' : 'text-gray-800'}`}>At Thirtysixstudio, we build immersive digital experiences for brands with a purpose.</h1>
        <p className={`text-sm z-[2] scroll-trigger-text ${darkMode ? 'text-white' : 'text-black'} pt-8`}>We're a boutique production studio focused on design, motion, and creative technology, constantly reimagining what digital craft can do for present-time ads and campaigns.</p>
        <p className={`text-0.5sm text-bold z-[2] scroll-trigger-text ${darkMode ? 'text-white' : 'text-black'} pt-8`}>Scroll</p>
      </div>
      <div id='rotate'>
        {[..."THIRTYSIXSTUDIO — FOR ALL THINGS DIGITAL PRODUCTION — "].map((char, i) => (
          <span
            key={i}
            style={{
              transform: `rotate(${i * 6.7}deg)`,
              color: darkMode ? '#fff' : '#000',
              zIndex: 2
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
    <div ref={headingref} className="w-full h-[38%] flex justify-center items-center relative z-[1]">
      <h1 className={`text-[15vw] z-[2] scroll-trigger-heading ${darkMode ? 'text-white' : 'text-black'} font-[king]`}>Thirtysixstudio</h1>
    </div>
    <div className="w-full min-h-screen " >
    {showCanvas && data[0].map((canvasdets,index)=>(
      <Canvas key={index} details={canvasdets} />
    ))}
  </div>
  </div>
  <div className={`w-full h-screen relative border-t-[1px] border-zinc-500 flex justify-end items-center ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
    <div className='w-[35%] h-[80%] pt-10'>
        <h4 className={`${darkMode ? 'text-white' : 'text-black'} text-xl font-[king] z-[2] scroll-trigger-text`}>01 - WHAT WE DO</h4>
    </div>
    <div className='w-[40%] h-[80%] pr-[13%]'>
        <h1 className={`${darkMode ? 'text-white' : 'text-black'} text-[4vh] font-[king] pt-10 font-thin leading-[1.2] z-[2] scroll-trigger-text`}>We aim to revolutionize digital production in the advertising space, bringing your ideas to life.</h1>
        <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.75vh] pt-[10vh] z-[2] scroll-trigger-text`}>As a contemporary studio, we use cutting-edge design practices and the latest technologies to deliver seamless digital work.</p>
        <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.75vh] pt-5 z-[2] scroll-trigger-text`}>
        Our commitment to creativity, innovation, and simplicity, paired with our agile approach, ensures your journey with us is smooth and enjoyable from start to finish.
        </p>
    </div>
    <div className="w-full absolute min-h-screen " >
    {showCanvas && data[1].map((canvasdets,index)=>(
        <Canvas key={index} details={canvasdets} />
    ))}
  </div>
  </div>
  <div className={`w-full h-screen relative flex flex-col items-center border-t-[1px] border-zinc-500 ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
      <div className='w-[100%] h-[45%] flex flex-col justify-center pl-[25%] pr-[15%]'>
        <h6 className={`${darkMode ? 'text-white' : 'text-black'} text-[1.5vh] font-[king] pt-10 z-[2] scroll-trigger-text`}>OUR SERVICES</h6>
        <p className={`${darkMode ? 'text-white' : 'text-black'} text-[3.5vh] pt-10 leading-[1.2] z-[2] scroll-trigger-text`}>We provide captivating design,interactive animations,advanced usability, reliable code, and immaculate project coordination.Whether you need a campaign built from scratch or assistance at a specific phase, we've got you covered.</p>
      </div>
      <div className='w-[100%] h-[55%] '>
        <Toggle name="CREATIVE DIRECTION" darkMode={darkMode} />
        <Toggle name="DESIGN" darkMode={darkMode} />
        <Toggle name="DEVELOPMENT" darkMode={darkMode} />
        <Toggle name="MOTION" darkMode={darkMode} />
        <Toggle name="3D ANIMATION" darkMode={darkMode} />
        <Toggle name="PROJECT MANAGEMENT" darkMode={darkMode} />
      </div>
      
  </div>
  <div className={`w-full h-[50vh] relative flex flex-col pl-[25%] pt-[10vh] border-b-[1px] border-zinc-500 ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
      <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.5vh] font-[king] z-[2] scroll-trigger-text`}>Got a project in mind?</p>
      <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.5vh] font-[king] z-[2] scroll-trigger-text`}>Drop us a line at hello@thirtysixstudio.com or use the form below.</p>
      <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.5vh] font-[king] w-[23.1%] mt-[2vh] z-[2] scroll-trigger-text`}>Not sure what you need? We're here to help you define the undefined. Let's explore all creative and technical possibilities together through one of our tailored labs, where we champion future-forward thinking within an ethical framework.</p>
      <button className={`w-[8%] h-[3.5vh] border-[1px] mt-[4vh] rounded-full z-[2] ${darkMode ? 'border-white text-white hover:border-gray-300' : 'border-zinc-400 text-black hover:border-black'} transition-all duration-300 text-[1.5vh] font-[king] mt-[2vh] scroll-trigger-text`}><h1 className='underline'>TALK TO US</h1></button>
      <div className="w-full absolute min-h-screen " >
    {showCanvas && data[4].map((canvasdets,index)=>(
        <Canvas key={index} details={canvasdets} />
    ))}
  </div>
  </div>
  <div className={`w-full h-[105vh] relative flex flex-col ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
      <div className="w-full h-[30vh] flex justify-between items-center pl-[25%] pr-[17%]">
        <h4 className={`${darkMode ? 'text-white' : 'text-black'} text-xl font-[king] z-[2] scroll-trigger-text`}>02 - WHO WE ARE</h4>
        <h1 className={`w-[23vw] ${darkMode ? 'text-white' : 'text-black'} text-[3.5vh] font-[king] leading-[1.2] z-[2] scroll-trigger-text`}>Our vision is to simplify digital production while creating social impact and opportunity.</h1>
      </div>
      <div className="w-full h-[25vh] flex justify-between items-center pr-[17%]">
        <h1 className={`w-[20vw] pl-[1%] ${darkMode ? 'text-white' : 'text-black'} text-[8.5vw] font-[king] z-[2] scroll-trigger-text`}>Agile</h1>
        <p className={`w-[23vw] ${darkMode ? 'text-white' : 'text-black'} leading-[1.2] z-[2] scroll-trigger-text`}>We live and breathe efficiency and are not limited by geography. Based in Amsterdam with hubs in London, Paris, Johannesburg, New York, and beyond, we curate the right team for each project and get moving swiftly.</p>
      </div>
      <div className="w-full h-[25vh] flex justify-between items-center pr-[17%]">
        <h1 className={`w-[20vw] pl-[1%] ${darkMode ? 'text-white' : 'text-black'} text-[8.5vw] font-[king] z-[2] scroll-trigger-text`}>Innovative</h1>
        <p className={`w-[23vw] ${darkMode ? 'text-white' : 'text-black'} leading-[1.2] z-[2] scroll-trigger-text`}>We use innovative digital processes and technology to ensure our initiatives run smoothly, allowing our young, lean, and international team to focus on what matters and maximize momentum and opportunity.</p>
      </div>
      <div className="w-full h-[25vh] flex justify-between items-center pr-[17%]">
        <h1 className={`w-[20vw] pl-[1%] ${darkMode ? 'text-white' : 'text-black'} text-[8.5vw] font-[king] z-[2] scroll-trigger-text`}>Cultured</h1>
        <p className={`w-[23vw] ${darkMode ? 'text-white' : 'text-black'} leading-[1.2] z-[2] scroll-trigger-text`}>We are progressive and community-focused, and don't believe in maintaining the status quo or sticking to the old way. Our people reflect today's realities and stay connected to culture.</p>
      </div>
      
  </div>
  <div className={`w-full h-[80vh] relative flex items-center justify-end ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
    <div className="w-[60%] h-[80vh]"></div>
    <div className="w-[40%] h-[80vh]">
        <h1 className={`${darkMode ? 'text-white' : 'text-black'} text-[2vw] font-[king] pr-[17%] pt-[15vh] z-[2] scroll-trigger-text`}>We represent today's world: progressive and engaged.</h1>
        <p className={`${darkMode ? 'text-white' : 'text-black'} pr-[17%] pt-[10vh] z-[2] scroll-trigger-text`}>Thirtysixstudio is founded by Gita Jagessar, a queer person of color and seasoned production director from Amsterdam. With over 12 years of experience in digital advertising, Gita has worked with renowned global brands such as Netflix, Converse, Travis Scott, Ben & Jerry's, and Cash App.</p>
        <button className={`w-[20%] h-[3.5vh] border-[1px] mt-[4vh] rounded-full z-[2] ${darkMode ? 'border-white text-white hover:border-gray-300' : 'border-zinc-400 text-black hover:border-black'} transition-all duration-300 text-[1.5vh] font-[king] mt-[2vh] scroll-trigger-text`}><h1 className='underline'>LEARN MORE</h1></button>
    </div>
    <div className="w-full absolute min-h-screen " >
    {showCanvas && data[1].map((canvasdets,index)=>(
        <Canvas key={index} details={canvasdets} />
    ))}
  </div>
  </div>
  <div className={`w-full h-[120vh] relative flex flex-col items-center justify-center ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
    <div className='w-[100%] h-[60vh] flex flex-col justify-center pl-[25%]'>
      <h4 className={`${darkMode ? 'text-white' : 'text-black'} text-xl font-[king] z-[2] scroll-trigger-text`}>03 - HOW WE GIVE BACK</h4>
      <p className={`${darkMode ? 'text-white' : 'text-black'} text-[3.5vh] pt-11 pr-[22%] leading-[1.2] z-[2] scroll-trigger-text`}>At Thirtysixstudio, we recognize that our industry can perpetuate harm.We believe we have to try and reverse some of these imbalances.That's why we're launching SS36, our local social sustainability hub.</p>
      <p className={`${darkMode ? 'text-white' : 'text-black'} text-[3.5vh] pt-10 pr-[22%] leading-[1.2] z-[2] scroll-trigger-text`}>Through SS36, were invest some of our revenue and expertise into the communities that shape the culture and trends our field so heavily relies on.Our main focus is on bridging gaps for those affected by systemic obstacles related to race, sexuality, wealth, and gender identity.</p>
    </div>
    
    <div className='w-[100%] h-[45vh] pl-[25%] pr-[45%]'>
      <p className={`${darkMode ? 'text-white' : 'text-black'} pr-[17%] pt-[10vh] z-[2] scroll-trigger-text`}>Our SS36 work includes community-centric projects for local marginalized groups, as well as career initiatives for marginalized industry talent.</p>
      <p className={`${darkMode ? 'text-white' : 'text-black'} pr-[17%] pt-[5vh] z-[2] scroll-trigger-text`}>As a client, the most impactful way you can assist us in reaching our social sustainability goals is by collaborating with our team on a project. We warmly welcome partner- and sponsorships from like-minded individuals and organizations.</p>
      <button className={`w-[20%] h-[3.5vh] border-[1px] mt-[4vh] rounded-full z-[2] ${darkMode ? 'border-white text-white hover:border-gray-300' : 'border-zinc-400 text-black hover:border-black'} transition-all duration-300 text-[1.5vh] font-[king] mt-[2vh] scroll-trigger-text`}><h1 className='underline'>GET IN TOUCH</h1></button>
    </div>
    <div className="w-full absolute min-h-screen " >
    {showCanvas && data[5].map((canvasdets,index)=>(
        <Canvas key={index} details={canvasdets} />
    ))}
  </div>
  </div>
  <div className={`w-full h-[80vh] relative flex items-center justify-end ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
    <div className='w-[35%] h-[80%] pt-10'>
        <h4 className={`${darkMode ? 'text-white' : 'text-black'} text-xl font-[king] z-[2] scroll-trigger-text`}>04 - TALK TO US</h4>
    </div>
    <div className='w-[40%] h-[80%] pr-[13%]'>
        <p className={`${darkMode ? 'text-white' : 'text-black'} font-[king] pt-10 z-[2] scroll-trigger-text`}>TALENT</p>
        <h1 className={`${darkMode ? 'text-white' : 'text-black'} text-[4vh] font-[king] pt-10 font-thin leading-[1.2] z-[2] scroll-trigger-text`}>Thirtysixstudio is seeking talented collaborators.</h1>
        <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.75vh] pt-[10vh] z-[2] scroll-trigger-text`}>If you are a multi-talented individual with exceptional communication skills, eager to elevate your digital craft together with us, we want to hear from you.</p>
        <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.75vh] pt-5 z-[2] scroll-trigger-text`}>
        We specifically welcome progressive people who value high-quality work and workplace well-being equally. At Thirtysixstudio, we believe that one can only exist in the presence of the other.
        </p>
        <button className={`w-[30%] h-[3.5vh] border-[1px] mt-[4vh] rounded-full z-[2] ${darkMode ? 'border-white text-white hover:border-gray-300' : 'border-zinc-400 text-black hover:border-black'} transition-all duration-300 text-[1.5vh] font-[king] mt-[2vh] scroll-trigger-text`}><h1 className='underline'>DROP US A LINE</h1></button>
    </div>
  </div>
  <div className={`w-full h-[120vh] relative flex flex-col justify-between items-center ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
    <div className='w-[100%] h-[50vh]'>
    <Toggle2 name="ROLLS OPEN" darkMode={darkMode} />
    </div>
    <div className="w-full h-[50vh]">
      <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.5vh] font-[king] pt-[10vh] pl-[25%] z-[2] scroll-trigger-text`}>CLIENTS</p>
      <h1 className={`${darkMode ? 'text-white' : 'text-black'} text-[4vh] font-[king] pt-[5vh] pl-[25%] pr-[48%] z-[2] scroll-trigger-text`}>Ready to get your project off the ground?</h1>
      <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.75vh] pt-[5vh] pl-[25%] pr-[48%] z-[2] scroll-trigger-text`}>We're currently accepting new clients and are excited to hear from you. Get in touch by sending an email to hello@thirtysixstudio.com or fill out the form below to start your journey with us.</p>
    </div>
  </div>
  <div className={`w-full h-[100vh] relative flex flex-col items-center justify-center border-b-[1px] border-zinc-500 ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
    <div className="w-[60vw] h-[100vh] flex flex-col items-center justify-center">
      <form action="" className='flex flex-col justify-center'>
        <input type="text" placeholder='Name*' className={`w-[50vw] h-[7vh] border-[1px] bg-transparent z-[2] ${darkMode ? 'border-white text-white placeholder-white' : 'border-zinc-400 text-black placeholder-black'} rounded-full mt-[2vh] pl-[3%] placeholder:text-[3vh]`} />
        <input type="email" placeholder='Email*' className={`w-[50vw] h-[7vh] border-[1px] bg-transparent z-[2] ${darkMode ? 'border-white text-white placeholder-white' : 'border-zinc-400 text-black placeholder-black'} rounded-full mt-[2vh] pl-[3%] placeholder:text-[3vh]`} />
        <input type="text" placeholder='Topic*' className={`w-[50vw] h-[7vh] border-[1px] bg-transparent z-[2] ${darkMode ? 'border-white text-white placeholder-white' : 'border-zinc-400 text-black placeholder-black'} rounded-full mt-[2vh] pl-[3%] placeholder:text-[3vh]`} />
        <textarea name="Message" placeholder='Message' id="" className={`w-[50vw] h-[20vh] border-[1px] bg-transparent z-[2] ${darkMode ? 'border-white text-white placeholder-white' : 'border-zinc-400 text-black placeholder-black'} rounded-lg mt-[10vh] pl-[3%] pt-[2vh] placeholder:text-[1.5vh]`}></textarea>
        <button type="submit" className={`w-[5vw] h-[3.5vh] border-[1px] z-[2] ${darkMode ? 'text-white border-white hover:border-gray-300' : 'text-zinc-400 border-zinc-400 hover:text-black hover:border-black'} rounded-full mt-[2vh] underline`}>SEND</button>
      </form>
    </div>
  </div>
  <div className={`w-full h-[10vh] flex justify-center items-center ${darkMode ? 'bg-black' : 'bg-transparent'}`}>
    <p className={`${darkMode ? 'text-white' : 'text-black'} text-[1.5vh] font-[king] z-[2]`}>Made with ❤️ by Rahul Jha</p>
  </div>

  
  
  </>)
}

export default App