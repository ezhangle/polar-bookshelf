import * as React from 'react';
import {BaseDocAnnotation} from "../../../../../../web/js/datastore/sharing/db/doc_annotations/BaseDocAnnotation";
import {TextHighlightDocAnnotationComponent} from "./TextHighlightDocAnnotationComponent";
import {Logger} from "../../../../../../web/js/logger/Logger";
import {isPresent} from "../../../../../../web/js/Preconditions";
import {AnnotationType} from "../../../../../../web/js/metadata/AnnotationType";
import {PersistenceLayerProvider} from "../../../../../../web/js/datastore/PersistenceLayer";
import {AreaHighlightDocAnnotationComponent} from "./AreaHighlightDocAnnotationComponent";

const log = Logger.create();

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class DocAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const { docAnnotation } = this.props;

        if (! isPresent(docAnnotation.id)) {
            log.warn("No annotation id!", docAnnotation);
            return;
        }

        if (docAnnotation.id.trim() === '') {
            log.warn("Empty annotation id");
            return;
        }

        const key = 'doc-annotation-' + docAnnotation.id;

        if (docAnnotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {

            return (

                <AreaHighlightDocAnnotationComponent key={key}
                                                     persistenceLayerProvider={this.props.persistenceLayerProvider}
                                                     docAnnotation={docAnnotation}/>
            );

        } else if (docAnnotation.annotationType === AnnotationType.TEXT_HIGHLIGHT) {

            return (
                <TextHighlightDocAnnotationComponent key={key}
                                                     docAnnotation={docAnnotation}/>
            );

        } else {
            return <div/>;
        }


    }

}
interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly docAnnotation: BaseDocAnnotation;
}

interface IState {

}

