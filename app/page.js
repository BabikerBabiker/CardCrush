"use client";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GlobalStyle = styled("style")`
  @keyframes gradientBackground {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
`;

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#000000",
  color: "#ffffff",
  position: "fixed",
  width: "100%",
  zIndex: 1201,
});

const Footer = styled(Box)({
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "20px 0",
  textAlign: "center",
  marginTop: "auto",
});

const HeroSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  color: "#ffffff",
  textAlign: "center",
  padding: "0 20px",
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(45deg, #081414, #000000)",
  backgroundSize: "400% 400%",
  animation: "gradientBackground 15s ease infinite",
});

const FeatureCard = styled(Paper)({
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
});

const PricingCard = styled(Paper)({
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
});

const ArrowButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  bottom: "30px",
  right: "20px",
  backgroundColor: "#a024b4",
  color: "#ffffff",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  minWidth: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  zIndex: 1201,
  "&:hover": {
    backgroundColor: "#b84ccf",
  },
  "&:focus": {
    outline: "none",
  },
  "&:active": {
    backgroundColor: "#a024b4",
  },
}));

export default function Home() {
  const [showArrowUp, setShowArrowUp] = useState(false);
  const contentRef = useRef(null);
  const priceRef = useRef(null);
  const heroRef = useRef(null);
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStartedClick = () => {
    if (isSignedIn) {
      router.push("/generate");
    } else {
      scrollToPricingPlans();
    }
  };

  const scrollToPricingPlans = () => {
    if (priceRef.current) {
      window.scrollTo({
        top: priceRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/checkout_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "https://cardcrush.bbabiker.com/",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const checkoutSessionJson = await response.json();

      if (checkoutSessionJson.statusCode === 500) {
        console.error(checkoutSessionJson.message);
        return;
      }

      const stripe = await getStripe();

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowArrowUp(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    if (contentRef.current) {
      window.scrollTo({
        top: contentRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const scrollToHeroSection = () => {
    if (heroRef.current) {
      window.scrollTo({
        top: heroRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box>
      <Head>
        <title>CardCrush</title>
        <meta
          name="description"
          content="Create Flashcards from your text very simply"
        />
      </Head>

      {}
      <GlobalStyle />

      <StyledAppBar>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CardCrush
          </Typography>
          <SignedOut>
          <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <Button color="inherit" href="/flashcards">
              Collections
            </Button>
            <Button color="inherit" href="/generate" sx={{mr: 2}}>
              Generate
            </Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </StyledAppBar>

      {}
      <HeroSection ref={heroRef}>
        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 3 }}>
          Welcome to CardCrush
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: "#b0b0b0", mb: 10 }}>
          Create flashcards effortlessly from your prompt and enhance your
          learning experience using Artificial Intelligence.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 20, width: "200px", height: "60px" }}
          onClick={handleGetStartedClick}
        >
          Get Started
        </Button>
      </HeroSection>

      {}
      <Container maxWidth="lg" sx={{ pt: "100px" }} ref={contentRef}>
        {" "}
        {}
        <Box sx={{ my: 6 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center", mb: 7 }}
          >
            Key Features
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mb: 20 }}>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Easy Text Input
                </Typography>
                <Typography>
                  Simply input your text and let us handle it. Creating
                  flashcards has never been easier!
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Smart Flashcards
                </Typography>
                <Typography>
                  Our AI breaks down your text into concise, effective
                  flashcards perfect for studying.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Accessible Anywhere
                </Typography>
                <Typography>
                  Access your flashcards from any device and study on the go.
                  Learning has never been so flexible!
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Collaborative Learning
                </Typography>
                <Typography>
                  Share your flashcards with others and collaborate on study
                  sessions. Enhance your learning with teamwork!
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 7 }}
          >
            Pricing Plans
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mb: 20 }} ref={priceRef}>
            <Grid item xs={12} md={4}>
              <PricingCard>
                <Typography variant="h5" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $0 / Month
                </Typography>
                <Typography>
                  Access to basic features and limited storage. Perfect for
                  individuals getting started.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2, borderRadius: 20 }}
                  href="/sign-up"
                >
                  Choose Basic
                </Button>
              </PricingCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PricingCard>
                <Typography variant="h5" gutterBottom>
                  Premium
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $5 / Month
                </Typography>
                <Typography>
                  ***CURRENTLY UNAVAILABLE*** All basic features plus expanded
                  storage. Ideal for regular users needing more functionality.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2, borderRadius: 20 }}
                  onClick={handleSubmit}
                >
                  Choose Pro
                </Button>
              </PricingCard>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {}
      <ArrowButton
        onClick={showArrowUp ? scrollToHeroSection : scrollToContent}
      >
        {showArrowUp ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </ArrowButton>
      
      <Footer sx={{pb:5, pt: 5, pr: 2, pl: 2}}r>
        <Typography variant="body2">
          © CardCrush 2024. All rights reserved.
        </Typography>
        <Typography variant="caption">
          Disclaimer: While we strive for accuracy, flashcards generated by AI may contain errors. Please review the content for accuracy before use.
        </Typography>
      </Footer>
    </Box>
  );
}