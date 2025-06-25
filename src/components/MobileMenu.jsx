import { useState } from 'react';
import MenuIcon from '../icons/menu.svg?react';
import CloseIcon from '../icons/close.svg?react';
import { headerLinks } from './links';

export default function MenuToggle() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {menuOpen ? 
        <CloseIcon
        className="md:hidden size-10 text-grayish-violet"
        onClick={() => setMenuOpen(false)} /> :
        <MenuIcon
          className="md:hidden size-10 text-grayish-violet"
          onClick={() => setMenuOpen(true)} />
      }
      {menuOpen && <MobileNav />}
    </>
  );
}

function MobileNav() {
  return (
    <div className='flex md:hidden absolute top-23 left-0 w-full px-7'>
      <nav className='flex flex-col rounded-xl bg-violet-brand p-7 w-full'>
        <div className='flex flex-col gap-5 items-center pb-7 border-b border-b-neutral-500'>
          {headerLinks.map(link => 
            <a
              href={link.url}
              className='font-semibold text-white hover:text-cyan-brand transition'>
              {link.title}
            </a>
          )}
        </div>

        <div className='flex flex-col gap-5 items-center'>
          <a
            href='#'
            className='font-semibold text-white pt-7 hover:text-cyan-brand transition'>
            Login
          </a>
          <a
            href='#'
            className='font-semibold text-white rounded-full p-3 w-full bg-cyan-brand text-center hover:bg-cyan-hover transition'>
            Sign Up
          </a>
        </div>
      </nav>
    </div>
  );
}