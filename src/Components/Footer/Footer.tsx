import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import logo from "/events.svg";

const StyledFooter = styled(Box)(() => ({
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  padding: "48px 0 24px 0",
  position: "relative",
  bottom: 0,
  width: "100%",
}));

const SocialIcon = styled(IconButton)(() => ({
  color: "#ffffff",
  margin: "0 8px",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
    color: "#4a90e2",
  },
}));

const FooterLink = styled(Link)(() => ({
  color: "#ffffff",
  textDecoration: "none",
  "&:hover": {
    color: "#4a90e2",
    textDecoration: "none",
  },
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: "About Us", url: "#" },
    { title: "Services", url: "#" },
    { title: "Products", url: "#" },
    { title: "Contact", url: "#" },
  ];

  const legalLinks = [
    { title: "Privacy Policy", url: "#" },
    { title: "Terms of Service", url: "#" },
    { title: "Cookie Policy", url: "#" },
  ];

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Box mb={3}>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "60px", marginBottom: "16px" }}
              />
              <Typography variant="body1" sx={{ mb: 2 }}>
                We are dedicated to providing innovative solutions for your
                business needs. Our commitment to excellence drives everything
                we do.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <List>
              {quickLinks.map((link) => (
                <ListItem key={link.title} sx={{ p: 0, mb: 1 }}>
                  <FooterLink href={link.url}>{link.title}</FooterLink>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: +1 (555) 123-4567
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@company.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Address: 123 Business Street, Suite 100, City, State 12345
            </Typography>

            {/* Social Media */}
            <Stack direction="row" spacing={1}>
              <SocialIcon aria-label="Facebook">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon aria-label="Twitter">
                <XIcon />
              </SocialIcon>
              <SocialIcon aria-label="LinkedIn">
                <LinkedInIcon />
              </SocialIcon>
              <SocialIcon aria-label="Instagram">
                <GitHubIcon />
              </SocialIcon>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            mt: 4,
            pt: 2,
            textAlign: "center",
          }}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                © {currentYear} Company Name. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent={{ xs: "center", sm: "flex-end" }}
              >
                {legalLinks.map((link) => (
                  <FooterLink key={link.title} href={link.url} variant="body2">
                    {link.title}
                  </FooterLink>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
