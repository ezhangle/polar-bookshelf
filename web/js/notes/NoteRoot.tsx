import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Note } from "./Note";
import { NoteStyle } from "./NoteStyle";
import { NoteIDStr } from "./store/NotesStore";
import { useNotesStore } from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import {NoteSelectionHandler} from "./NoteSelectionHandler";

interface IProps {
    readonly target: NoteIDStr;
}

export const NoteRoot = observer((props: IProps) => {

    // useLifecycleTracer('NoteRoot', {target: props.target});

    const {target} = props;

    const store = useNotesStore();

    const note = store.getNoteByTarget(target)

    React.useEffect(() => {
        // TODO: do this with one init() operation so it mutates the store just once.

        if (note) {
            store.setRoot(note.id);
            store.setActive(note.id);
        } else {
            console.warn("No note for target: ", target);
        }

    }, [note, store, target])

    if (! note) {
        return (
            <div>No note for target: {props.target}</div>
        );
    }

    const id = note?.id;

    return (
        <NoteSelectionHandler style={{flexGrow: 1}}>
            <NoteStyle>
                <MUIBrowserLinkStyle style={{flexGrow: 1}}>

                    <Note parent={undefined} id={id}/>

                    <NotesInbound id={id}/>

                </MUIBrowserLinkStyle>
            </NoteStyle>
        </NoteSelectionHandler>
    );

});
