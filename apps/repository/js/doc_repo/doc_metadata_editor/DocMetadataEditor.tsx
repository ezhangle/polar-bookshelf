import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import { StringProperty } from './StringProperty';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { StringArrayAutocompleteProperty } from './StringArrayAutocompleteProperty';
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import { TextProperty } from './TextProperty';

/**
 * Represents a property on the DocInfo
 */
export interface DocInfoProperty {
    readonly name: keyof IDocInfo;
    readonly label?: string;
    readonly description?: string;
    readonly optional?: true;
    readonly type: 'string' | 'string[]' | 'text';
}

// TODO: we will need to special handle arrays with a component that can work
// with an array of strings.

// TODO: move over every field from IDocBib.

const FIELDS: ReadonlyArray<DocInfoProperty> = [
    {
        name: 'title',
        optional: true,
        type: 'string'
    },
    {
        name: 'description',
        description: "A short description for the document",
        optional: true,
        type: 'string'
    },
    {
        name: 'abstract',
        description: "A long text overview of the document",
        optional: true,
        type: 'text'
    },
    {
        name: 'volume',
        optional: true,
        type: 'string'
    },
    {
        name: 'edition',
        optional: true,
        type: 'string'
    },
    {
        name: 'issn',
        label: 'ISSN',
        optional: true,
        type: 'string'
    },
    {
        name: 'isbn',
        label: 'ISBN',
        description: 'An International Standard Book Number is a numeric commercial book identifier.',
        optional: true,
        type: 'string'
    },
    {
        name: 'doi',
        label: 'DOI',
        description: 'Document Identifier (doi)',
        optional: true,
        type: 'string'
    },
    {
        name: 'pmid',
        label: 'PMID',
        description: 'PubMed ID',
        optional: true,
        type: 'string'
    },
    {
        name: 'journal',
        optional: true,
        type: 'string'
    },
    {
        name: 'publisher',
        description: 'The publisher of this document.  Usually the name of an academic journal',
        optional: true,
        type: 'string'
    },
    {
        name: 'copyright',
        description: 'The copyright of this document.',
        optional: true,
        type: 'string'
    },
    {
        name: 'keywords',
        description: 'The keywords that are defined by the publisher for this document',
        optional: true,
        type: 'string[]'
    },
    {
        name: 'authors',
        description: 'The author or authors of this document',
        optional: true,
        type: 'string[]'
    },
    {
        name: 'editor',
        description: 'The editor or editors of this document',
        optional: true,
        type: 'string[]'
    }

    // TODO: abstract, subtitle

];

const useStyles = makeStyles(() =>
    createStyles({
        box: {
            display: 'flex'
        },
        property: {
            flexGrow: 1
        },
    }),
);

interface IProps {
    readonly docInfo: IDocInfo;
    readonly onUpdate: (docInfo: IDocInfo) => void;
}

export const DocMetadataEditor = deepMemo((props: IProps) => {

    const [docInfo, setDocInfo] = React.useState(props.docInfo);
    const classes = useStyles();

    const handleFieldChangeForString = React.useCallback((field: DocInfoProperty, value: string) => {

        const newDocInfo = Dictionaries.copyOf(props.docInfo);

        if (field.optional) {
            newDocInfo[field.name] = value.trim() === '' ? undefined : '';
        } else {
            newDocInfo[field.name] = value;
        }

        props.onUpdate(newDocInfo);

    }, [props]);

    const handleFieldChangeForStringArray = React.useCallback((field: DocInfoProperty, values: ReadonlyArray<string>) => {

        const newDocInfo = Dictionaries.copyOf(props.docInfo);

        if (field.optional) {
            newDocInfo[field.name] = values.length === 0 ? undefined : values;
        } else {
            newDocInfo[field.name] = values;
        }

        props.onUpdate(newDocInfo);

    }, [props]);

    const toComponent = React.useCallback((property: DocInfoProperty) => {

        switch (property.type) {
            case "string":
                return (
                    <StringProperty className={classes.property}
                                    docInfo={docInfo}
                                    value={docInfo[property.name] as string}
                                    onChange={value => handleFieldChangeForString(property, value)}
                                    {...property}/>
                );
            case "string[]":
                // return (
                //     <StringArrayField className={classes.field}
                //                       docInfo={docInfo}
                //                       values={docInfo[field.name] as string[]}
                //                       onUpdate={setDocInfo}
                //                       {...field}/>
                // );

                return (
                    <StringArrayAutocompleteProperty className={classes.property}
                                                     docInfo={docInfo}
                                                     values={docInfo[property.name] as string[]}
                                                     onChange={values => handleFieldChangeForStringArray(property, values)}
                                                     {...property}/>
                );
            case "text":
                return (
                    <TextProperty className={classes.property}
                                  docInfo={docInfo}
                                  value={docInfo[property.name] as string}
                                  onChange={value => handleFieldChangeForString(property, value)}
                                  {...property}/>
                );

            default:
                return null;
        }

    }, [classes.property, docInfo, handleFieldChangeForString, handleFieldChangeForStringArray]);

    return (
        <div>
            {FIELDS.map(current => (
                <Box key={current.name}
                     className={classes.box}
                     mt={1}>
                    {toComponent(current)}
                </Box>
            ))}
        </div>
    );

});