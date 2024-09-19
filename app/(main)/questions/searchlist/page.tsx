'use client';
import { QuestionsService } from '../../../../service/QuestionsService';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Editor } from 'primereact/editor';
import './searchlist.css'; // Custom styles

const DEFAULT_PAGE_SIZE = 5;
const QuestionSearchList = () => {
    const [MCQ, setMCQ] = useState<Questions.MCQ[]>([]);
    const [loading, setLoading] = useState(false); // what is this for
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [dataScrollerRow, setDataScrollerRow] = useState(0);

    useEffect(() => {
        if (loading) return;
        setLoading(true);
        //console.log('dataScrollerRow:', dataScrollerRow);
        //console.log("calPage", Math.floor(dataScrollerRow / DEFAULT_PAGE_SIZE));
        var loadPage = currentPage;
        if (Math.floor(dataScrollerRow / DEFAULT_PAGE_SIZE) > currentPage) {
            //load next page
            loadPage++;
        }
        if (currentPage != 0 && loadPage != 0 && (loadPage >= totalPages || loadPage <= currentPage)) {
            setLoading(false);
            return;
        }

        //console.log('load data current page', loadPage);
        const retrieveQuestionRequest: Questions.RetrieveQuestionRequest = {
            pageNumber: loadPage,
            pageSize: DEFAULT_PAGE_SIZE
        };
        QuestionsService.retrieveMCQ(retrieveQuestionRequest)
            .then((data) => {
                //console.log('MCQ', data.mcqs);
                setMCQ([...MCQ, ...data.mcqs]);
                setTotalPages(data.totalPages || 0);
                setCurrentPage(loadPage);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dataScrollerRow]);
    const formatDate = (value: Date | undefined) => {
        if (value == undefined) return '';

        var datevalue = new Date(value);
        return isNaN(datevalue.valueOf()) ? '' : datevalue.toLocaleDateString('en-SG');
    };
    const itemTemplate = (rowData: Questions.MCQ) => {
        const topics = rowData.topics.map((topic) => <Tag style={{ marginRight: '1em' }} severity="info" value={topic.name} key={topic.id}></Tag>);
        const skills = rowData.skills.map((skills) => <Tag style={{ marginRight: '1em' }} value={skills.name} key={skills.id}></Tag>);
        return (
            <div className="card mb-1">
                <div className="grid" key={rowData.id}>
                    {/* <div className="col-12">{rowData.stem}</div>  */}
                    <div className="col-12" style={{ margin: 0, padding: 0 }}>
                        <Editor value={rowData.stem} showHeader={false} readOnly style={{ border: 0 }} />
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Topics: </label>
                        {topics}
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Skills: </label>
                        {skills}
                    </div>
                    <div className="col-12 md:col-3">
                        <label>Status: </label>
                        {rowData.status}
                    </div>
                    <div className="col-12 md:col-3">
                        <label>Created on: </label>
                        {formatDate(rowData.createdOn)}
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Created by: </label>
                        {rowData.createdBy}
                    </div>
                    <div className="col-12 md:col-10">&nbsp;</div>
                    <div className="col-12 md:col-2">
                        <span></span>
                        {/* <Link href="/questions/edit"><Button icon="pi pi-pencil" rounded text/></Link> */}
                        <Link href={`/questions/edit?id=${rowData.id}`} passHref>
                            <Button icon="pi pi-pencil" size="large" rounded text />
                        </Link>
                        {/* <Button icon="pi pi-trash" size='large' rounded severity="danger" text /> */}
                    </div>
                </div>
            </div>
        );
    };

    const startContent = (
        <React.Fragment>
            <Link href="/questions/create">
                <Button icon="pi pi-plus" className="mr-2" />
            </Link>
            <Button
                icon="pi pi-upload"
                onClick={() => {
                    setCurrentPage(currentPage + 1);
                    setTotalPages(totalPages + 1);
                }}
            />
        </React.Fragment>
    );

    return (
        <div className="grid nested-grid">
            <div className="col-12">
                <div className="card">
                    <Toolbar start={startContent} />
                    <h5>List of Questions</h5>

                    <DataScroller
                        value={MCQ}
                        itemTemplate={itemTemplate}
                        rows={DEFAULT_PAGE_SIZE}
                        buffer={0.9}
                        lazy
                        onLazyLoad={(e) => {
                            setDataScrollerRow(e.first);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuestionSearchList;
