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
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { collection, getDocs } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
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
  position: "relative",
});

const FlipContainer = styled(Box)(({ flipped }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
}));

const CardFace = styled(Box)(({ flipped }) => ({
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
  transition: "opacity 0.3s ease",
}));

const FrontFace = styled(CardFace)({
  transform: "rotateY(0deg)",
});

const BackFace = styled(CardFace)({
  transform: "rotateY(180deg)",
});

const Footer = styled(Box)({
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "20px 0",
  textAlign: "center",
  marginTop: "auto",
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [collectionName, setCollectionName] = useState("");
  const searchParams = useSearchParams();
  const search = decodeURIComponent(searchParams.get("id"));
  const router = useRouter();

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      try {
        const colRef = collection(db, "users", user.id, search);
        const docs = await getDocs(colRef);
        const flashcards = [];

        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });

        setFlashcards(flashcards);
        setCollectionName(search);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleHome = () => {
    router.push("/flashcards");
  }

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  return (
    <Box sx={{ backgroundColor: "#081414", minHeight: "100vh" }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CardCrush
          </Typography>
          <Button color="inherit">
            <Link
              href="/flashcards"
              passHref
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              Collections
            </Link>
          </Button>
          <Button color="inherit" sx={{mr: 2}}>
            <Link
              href="/"
              passHref
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              Home
            </Link>
          </Button>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </StyledAppBar>

      <StyledContainer maxWidth="lg">
        <Box sx={{ textAlign: "center", mt: 10, mb: 4 }}>
          <StyledTypography variant="h4">
            {collectionName} Collection
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
                key={flashcard.id}
                display="flex"
                justifyContent="center"
              >
                <StyledCard>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <StyledCardContent>
                      <FlipContainer flipped={flipped[flashcard.id]}>
                        <FrontFace>
                          {}
                          <Typography variant="h6" component="div">
                            {flashcard.Front || "Front Text"}
                          </Typography>
                        </FrontFace>

                        <BackFace>
                          {}
                          <Typography variant="h6" component="div">
                            {flashcard.Back || "Back Text"}
                          </Typography>
                        </BackFace>
                      </FlipContainer>
                    </StyledCardContent>
                  </CardActionArea>
                </StyledCard>
              </Grid>
            ))
          ) : (
            <StyledTypography>No flashcards found.</StyledTypography>
          )}
        </Grid>
        <Box
              sx={{ display: "flex", justifyContent: "center", pb: 4 }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleHome}
                sx={{ borderRadius: 20 }}
              >
                Return
              </Button>
            </Box>
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