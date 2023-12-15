import React from 'react'
import CustomCard from '../custom/CustomCard'

function About() {
    return (
        <CustomCard className='h-[calc(100%-60px)] w-full bg-[#0008] px-8 py-6 flex flex-col gap-6 overflow-y-auto'>
            <div className='flex flex-col gap-2 px-4'>
                <div className='text-3xl'>&bull;&nbsp;&lt;About Us/&gt;</div>
                <div className='text-gray-300 text-lg px-6 font-sans'>Welcome to our simple and engaging social media platform! We're delighted to have you here as part of our growing community of creative minds, where you can freely share your thoughts, ideas, and updates with the world.</div>
            </div>
            <div className='flex flex-col gap-2 px-4'>
                <div className='text-3xl'>&bull;&nbsp;&lt;Our Vision/&gt;</div>
                <div className='text-gray-300 text-lg px-6 font-sans'>Our vision is to create a positive and inspiring online space for people to connect, learn, and engage with each other through meaningful content. We believe in empowering individuals to express themselves, fostering a supportive environment for constructive discussions, and promoting a culture of creativity and innovation.</div>
            </div>
            <div className='flex flex-col gap-2 px-4'>
                <div className='text-3xl'>&bull;&nbsp;&lt;Get Started/&gt;</div>
                <div className='text-gray-300 text-lg px-6 font-sans'>Join us today and be part of a vibrant community where you can discover and be discovered, learn and be inspired, and connect and make new friends. Let your creativity flourish, and share your unique voice with the world. Thank you for being part of our journey as we continue to evolve and grow together!
                    <br /><br />
                    <div className='font-semibold'>~The Communix Team</div>
                </div>
            </div>
        </CustomCard>
    )
}

export default About