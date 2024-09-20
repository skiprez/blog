import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Link from "next/link";
import { Button } from "../components/ui/button"

export default function Navigation() {
    return (
        <div className="flex flex-col items-start w-[300px] h-[700px] mt-20 ml-[220px]">
            <AddPhotoAlternateIcon className="w-[40px] h-[40px] mb-2"/>
            {/* Menu */}
            <Button variant="ghost" className="text-md font-semibold w-[90px]">
                <HomeOutlinedIcon className="w-[20px] h-[20px] mr-2"/>
                <Link href="/">Home</Link>
            </Button>
        </div>
    )
};