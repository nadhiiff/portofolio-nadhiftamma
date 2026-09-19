const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <center>
        <hr className="my-3 border-maroon/20 opacity-50 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-muted text-center font-body">
          © {currentYear}{" "}
          <a href="https://nadhiftamma.com" className="hover:underline hover:text-cream transition-colors">
            nadhiftamma™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  );
};

export default Footer;