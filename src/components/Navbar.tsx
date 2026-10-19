import { Icon } from "./Icon";

interface NavbarProps {
  onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="navbar">
      <button type="button" className="navbar-menu" onClick={onMenuClick} aria-label="Open navigation">
        <Icon name="menu" />
      </button>
      <h2>Footverse</h2>
      <span>Football, all in one place.</span>
    </header>
  );
}

export default Navbar;