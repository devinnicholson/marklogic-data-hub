import React from 'react';
import { Modal } from "antd";
import { MLButton } from '@marklogic/design-system';
import styles from './confirm-yes-no.module.scss';

const ConfirmYesNo = (props) => {

    return (
        <Modal
            visible={props.visible}
            bodyStyle={{textAlign: 'center'}}
            width={props.width ? props.width : 250}
            maskClosable={false}
            closable={false}
            footer={null}
            destroyOnClose={true}
        >
            <div className={styles.body}>{props.body}</div>
            <div>
                <div className={styles.buttonNo}>
                    <MLButton aria-label={props.labelNo ? props.labelNo : 'No'} onClick={props.onNo}>
                        {props.labelNo ? props.labelNo : 'No'}
                    </MLButton>
                </div>
                <div className={styles.buttonYes}>
                    <MLButton aria-label={props.labelYes ? props.labelYes : 'Yes'} type="primary" htmlType="submit" onClick={props.onYes}>
                        {props.labelYes ? props.labelYes : 'Yes'}
                    </MLButton>
                </div>
            </div>
        </Modal>
    );

};

export default ConfirmYesNo;
