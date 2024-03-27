import React, { useState, useContext } from "react";
import { LanguageContext } from "../../index.js";
import styled from "@emotion/styled";
import { Tooltip, Menu, MenuItem, IconButton as MuiIconButton } from "@mui/material";
import i18n from "../../i18n";


const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;
const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

function NavbarLanguagesDropdown() {
    const [anchorMenu, setAnchorMenu] = useState(null);
    const languageContext = useContext(LanguageContext);
    const selectedLanguage = languageContext.selectedLanguage;

    const toggleMenu = (event) => {
        setAnchorMenu(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorMenu(null);
    };

    const handleLanguageChange = (language) => {
        languageContext.setSelectedLanguage(language);
        closeMenu();
    };

    const languageOptions = Object.keys(i18n.options.resources).reduce((options, lang) => {
        options[lang] = {
            icon: `/static/img/flags/${i18n.t('languageFlag', { lng: lang })}.png`,
            name: i18n.t('languageName', { lng: lang }),
        };
        return options;
    }, {});



    return (
        <React.Fragment>
            <Tooltip title="Languages">
                <IconButton
                    aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={toggleMenu}
                    color="inherit"
                    size="large"
                >
                    <Flag src={languageOptions[selectedLanguage].icon} alt={languageOptions[selectedLanguage].name} />
                </IconButton>
            </Tooltip>
            <Menu
                id="menu-appbar"
                anchorEl={anchorMenu}
                open={Boolean(anchorMenu)}
                onClose={closeMenu}
            >
                {Object.keys(languageOptions).map((language) => (
                    <MenuItem
                        key={language}
                        onClick={() => handleLanguageChange(language)}
                    >
                        {languageOptions[language].name}
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    );
}

export default NavbarLanguagesDropdown;
