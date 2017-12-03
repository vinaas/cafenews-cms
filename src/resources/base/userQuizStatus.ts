import { Action } from "./status";

export class QuestionStatus {
    //Người viết bài
    static DRAFT_01: string = "DRAFT";
    static NEW_02: string = "NEW";
    static EDIT_03: string = "EDIT";
    static APPROVEREJECTED_05: string = "ApproveRejected";

    //Người duyệt bài
    static EDITATAPPROVE: string = "EDITATAPPROVE";
    static APPROVEREQUEST_04: string = "APPROVEREQUEST";
    static PUBLISHREJECTED_0141: string = "PublishReject";

    static MULTIAPPROVED_06: string = "MULTIAPPROVED";

    //Người đăng bài
    static APPROVED_011: string = "APPROVED";

    static PUBLISHREQUEST_012: string = "PUBLISHREQUEST";
    
    static DIEUCHINHGUIDANG_013: string = "DIEUCHINHGUIDANG";

    static PUBLISHED_014: string = "PUBLISHED";
    static EDITATPUBLISHED_017: string = "EDITATPUBLISHED";
    static PUBLISHLATER: string = "PUBLISHLATER";

    static UNPUBLISH_016: string = "UNPUBLISH";

    static KHOITAO: string = "KHOITAO";

    constructor() {

        // this.APPROVEREQUEST = "APPROVEREQUEST";
        // this.APPROVED = "APPROVED";
        // this.PUBLISHED = "PUBLISHED";
        // this.UNPUBLISH = "UNPUBLISH";
        // this.APPROVEREJECTED = "ApproveRejected";
        // this.PUBLISHREJECTED = "PublishReject";
    }

    static GetStatusName(status: string): string {
        var statusName = "";
        if (status == this.NEW_02) {
            statusName = "Vừa Tạo"
        } else if (status == this.DRAFT_01) {
            statusName = "Bản Nháp"
        } else if (status == this.EDIT_03) {
            statusName = "Điều Chỉnh"
        } else if (status == this.APPROVEREJECTED_05) {
            statusName = "Từ Chối Duyệt"
        } else if (status == this.APPROVEREQUEST_04) {
            statusName = "Chờ Duyệt"
        } else if (status == this.EDITATAPPROVE) {
            statusName = "Sửa Lúc Duyệt"
        } else if (status == this.APPROVED_011) {
            statusName = "Đã Duyệt"
        } else if (status == this.MULTIAPPROVED_06) {
            statusName = "Đã Duyệt"
        } else if (status == this.PUBLISHED_014) {
            statusName = "Đã Đăng"
        } else if (status == this.UNPUBLISH_016) {
            statusName = "Bị Gỡ Đăng"
        }
        else if (status == this.EDITATPUBLISHED_017) {
            statusName = "Điều Chỉnh Duyệt Đăng"
        } else if (status == this.PUBLISHREJECTED_0141) {
            statusName = "Bị Từ Chối Đăng"
        }else {
            statusName = status;
        }
        //return status;
        return statusName;
    }
}

export class QuestionActions {

    static checkActionEnable(actionNum: number, trangThai: string): boolean {
        if (trangThai === undefined) trangThai = QuestionStatus.KHOITAO;
        let flag = false;
        this.GetList().forEach(element => {
            if (element.actionNum == actionNum) {
                flag = element.listEnableStatus.includes(trangThai);
                return
            }
        });
        if (flag)
            console.log('action ', actionNum, 'trangThai ', trangThai, ' TRUE')

        console.log('action ', actionNum, 'trangThai ', trangThai, 'flag', flag)
        return flag;
    }

    static GetAfterStatus(actionNum: number): string {
        let objectStatus = '';
        this.GetList().forEach(element => {
            if (element.actionNum == actionNum) {
                objectStatus = element.afterStatus;
                return
            }
        });
        console.log('action ', actionNum, 'status ', objectStatus)
        return objectStatus;
    }

    static GetHistoryMessage(actionNum: number): string {
        let message = '';
        this.GetList().forEach(element => {
            if (element.actionNum == actionNum) {
                message = element.historyMessage;
                return
            }
        });
        // console.log('action ', actionNum, 'status ', message)
        return message;
    }


    static GetList(): Action[] {
        let List: Action[] = new Array<Action>();
        //Yêu Cầu 
        List.push(new Action(
            0, [
                QuestionStatus.KHOITAO,
                QuestionStatus.DRAFT_01
            ],
            QuestionStatus.DRAFT_01,
            'tạo nháp'
        ))
        List.push(new Action(
            1, [
                QuestionStatus.KHOITAO
            ],
            QuestionStatus.NEW_02,
            'đã tạo mới'
        ))
        List.push(new Action(
            2, [
                QuestionStatus.KHOITAO,
                QuestionStatus.DRAFT_01
            ],
            QuestionStatus.APPROVEREQUEST_04,
            'đã tạo và gửi điều chỉnh'

        ))

        List.push(new Action(
            3, [
                QuestionStatus.DRAFT_01,
                QuestionStatus.NEW_02,
                QuestionStatus.EDIT_03
            ],
            QuestionStatus.EDIT_03,
            'đã lưu'
        ))

        List.push(new Action(
            4, [
                QuestionStatus.DRAFT_01,
                QuestionStatus.NEW_02,
                QuestionStatus.EDIT_03
            ],
            QuestionStatus.APPROVEREQUEST_04,
            'đã Gửi Duyệt'
        ))

        List.push(new Action(
            5, [
                QuestionStatus.APPROVEREJECTED_05
            ],
            QuestionStatus.EDIT_03,
            'đã Điều Chỉnh'
        ))

        List.push(new Action(
            61, [
                QuestionStatus.APPROVEREQUEST_04
            ],
            QuestionStatus.APPROVEREJECTED_05,
            'đã Từ Chối Duyệt'
        ))

        List.push(new Action(
            6, [
                QuestionStatus.APPROVEREQUEST_04
            ],
            QuestionStatus.MULTIAPPROVED_06,
            'đã Duyệt'
        ))

        List.push(new Action(
            7, [
                QuestionStatus.MULTIAPPROVED_06,
            ],
            QuestionStatus.MULTIAPPROVED_06,
            'đã Chấm Điểm'
        ))

        List.push(new Action(
            11, [
                QuestionStatus.KHOITAO,
                QuestionStatus.MULTIAPPROVED_06
            ],
            QuestionStatus.APPROVED_011,
            'đã Duyệt cho Báo '
        ))

        List.push(new Action(
            112, [
                QuestionStatus.KHOITAO,
                QuestionStatus.MULTIAPPROVED_06,
            ],
            QuestionStatus.PUBLISHREQUEST_012,
            'đã Duyệt và Gửi Đăng'
        ))

        List.push(new Action(
            12, [
                QuestionStatus.APPROVED_011,
                QuestionStatus.DIEUCHINHGUIDANG_013,
            ],
            QuestionStatus.PUBLISHREQUEST_012,
            'đã Gửi Đăng cho Báo '
        ))

        List.push(new Action(
            13, [
                QuestionStatus.PUBLISHREJECTED_0141
            ],
            QuestionStatus.DIEUCHINHGUIDANG_013,
            'đã Điều Chỉnh'
        ))

        List.push(new Action(
            141, [
                QuestionStatus.PUBLISHREQUEST_012
            ],
            QuestionStatus.PUBLISHREJECTED_0141,
            'đã Từ Chối Đăng '
        ))

        List.push(new Action(
            14, [
                QuestionStatus.PUBLISHREQUEST_012,
                QuestionStatus.UNPUBLISH_016,
                QuestionStatus.EDITATPUBLISHED_017
            ],
            QuestionStatus.PUBLISHED_014,
            'đã Đăng cho Báo '
        ))

        List.push(new Action(
            15, [
                QuestionStatus.PUBLISHED_014
            ],
            QuestionStatus.EDITATPUBLISHED_017,
            'đã Điều Chỉnh '
        ))

        List.push(new Action(
            16, [
                QuestionStatus.PUBLISHED_014
            ],
            QuestionStatus.UNPUBLISH_016,
            'đã Gỡ Đăng '
        ))

        List.push(new Action(
            17, [
                QuestionStatus.UNPUBLISH_016
            ],
            QuestionStatus.EDITATPUBLISHED_017,
            'đã Điều Chỉnh '
        ))

        List.push(new Action(
            18, [
                QuestionStatus.UNPUBLISH_016
            ],
            QuestionStatus.PUBLISHREJECTED_0141,
            'đã Trả Về '
        ))

        return List;
    }
}

