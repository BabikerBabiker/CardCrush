"use client";
import { db } from "@/firebase";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#000000",
  color: "#ffffff",
  position: "fixed",
  width: "100%",
  zIndex: 1201,
});

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100vw",
  backgroundColor: "#081414",
  padding: "20px",
});

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#ffffff",
  textAlign: "center",
});

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 500,
  borderRadius: 12,
  boxShadow: theme.shadows[4],
  overflow: "hidden",
  backgroundColor: "#ffffff",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  border: "1px solid #ddd",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  textAlign: "center",
  padding: "16px",
  position: "relative",
});

const Footer = styled(Box)({
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "20px 0",
  textAlign: "center",
  marginTop: "auto",
});

const FrontFace = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px",
  boxSizing: "border-box",
  textAlign: "center",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  border: "1px solid #ddd",
  fontSize: "1rem",
  color: "#333",
});

const StyledLink = styled(Button)({
  color: "#ffffff",
  textDecoration: "none",
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;

      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleReturnHome = () => {
    router.push("/");
  };

  const handleGenerate = () => {
    router.push("/generate");
  };

  return (
    <Box sx={{ backgroundColor: "#081414", minHeight: "100vh" }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CardCrush
          </Typography>
          <StyledLink onClick={handleGenerate} passHref>
            Generate
          </StyledLink>
          <StyledLink onClick={handleReturnHome} passHref sx={{mr: 2}}>
            Home
          </StyledLink>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </StyledAppBar>

      <StyledContainer maxWidth="lg">
        <Box sx={{ textAlign: "center", mt: 10, mb: 4 }}>
          <StyledTypography variant="h4">
            Flashcards Collection
          </StyledTypography>
        </Box>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 10 }}>
          {flashcards.length > 0 ? (
            flashcards.map((flashcard) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={flashcard.name}
                display="flex"
                justifyContent="center"
              >
                <StyledCard>
                  <CardActionArea
                    onClick={() => handleCardClick(flashcard.name)}
                  >
                    <StyledCardContent>
                      <FrontFace>
                        {}
                        <Typography variant="h6" component="div">
                          {flashcard.name || "Flashcard Title"}
                        </Typography>
                      </FrontFace>
                    </StyledCardContent>
                  </CardActionArea>
                </StyledCard>
              </Grid>
            ))
          ) : (
            <StyledTypography>No flashcards found.</StyledTypography>
          )}
        </Grid>
      </StyledContainer>
      
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