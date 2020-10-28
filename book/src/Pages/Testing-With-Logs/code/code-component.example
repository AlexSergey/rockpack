import React, { useState } from "react";

export default function Toggle(props) {
    const [toggleState, setToggleState] = useState("off");

    function toggle() {
        setToggleState(toggleState === "off" ? "on" : "off");
    }

    return <div className={`switch ${toggleState}`} onClick={toggle} />;
}
