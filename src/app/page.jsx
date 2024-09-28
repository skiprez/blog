import Link from 'next/link';
import Image from 'next/image';
import PostForm from './components/PostCreateForm.jsx';
import { Button } from './components/ui/button.jsx';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import graphic_sample from '../public/graphic_sample.jpg';

export default function Home() {
  return (
      <main className="flex flex-col justify-center w-[700px]">
        
        {/* Home Transport */}
        <div className="text-white font-semibold text-xl border-b-[1px] border-x-[1px] border-white w-[700px] p-2">
          <Link href="/">
            Home
          </Link>
        </div>

        {/* Create a Post */}
        <div className="border-b-[1px] border-x-[1px] border-white w-[700px] min-h-[150px] p-2">

          {/* User Info */}
          <div className="flex flex-row max-w-[200px]">
            <Image src={graphic_sample} className="w-[50px] h-[50px] rounded-full mb-2"/>
            <p className="text-white font-semibold text-md ml-2">User Name</p>
          </div>

          {/* Post Content */}
          <div className="flex flex-col items-center">
            <PostForm />
          </div>
        </div>

        {/* Scrolling Menu */}
        <div className="text-white text-md border-b-[1px] border-x-[1px] border-white min-h-[800px] w-[700px]">

          {/* Sample Post */}
          <div className="border-b-[1px] border-white min-h-[100px] mt-2 flex flex-col p-2">

            {/* User Info */}
            <div className="flex flex-row max-w-[200px]">
              <Image src={graphic_sample} className="w-[50px] h-[50px] rounded-full mb-2"/>
              <p className="text-white font-semibold text-md ml-2">User Name</p>
            </div>
          
            {/* Post Content */}
            <div className="mt-[-30px] ml-[70px] max-w-[580px] flex flex-col">
              <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus eum odio veritatis delectus!</p>
              <Image src={graphic_sample} className="max-w-[550px] mb-2 mt-2 rounded-md shadow-lg"/>
            </div>

            {/* Post Actions */}
            <div className="mt-2 flex flex-row justify-around">

              {/* Like Action */}
              <div className="flex flex-row max-w-[120px] items-center justify-between">
                <Button variant="icon" size="icon">
                  <FavoriteBorderOutlinedIcon className="text-red-600" />
                </Button>
                <p className="text-xl mb-1 ml-2">129</p>
              </div>

              {/* Comment Action */}
              <div className="flex flex-row max-w-[120px] items-center justify-between">
                <Button variant="icon" size="icon">
                  <ChatBubbleOutlineOutlinedIcon className="text-green-600"/>
                </Button>
                <p className="text-xl mb-1 ml-2">24</p>
              </div>

              {/* Share Action */}
              <div className="flex flex-row max-w-[120px] items-center justify-between">
                <Button variant="icon" size="icon">
                  <ShareOutlinedIcon className="text-blue-600"/>
                </Button>
                <p className="text-xl mb-1 ml-2">64</p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
