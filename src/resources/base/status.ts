export class QuizStatus {
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

export class ListAction {

    static checkActionEnable(actionNum: number, trangThai: string): boolean {
        if (trangThai === undefined) trangThai = QuizStatus.KHOITAO;
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
                QuizStatus.KHOITAO,
                QuizStatus.DRAFT_01
            ],
            QuizStatus.DRAFT_01,
            'tạo nháp'
        ))
        List.push(new Action(
            1, [
                QuizStatus.KHOITAO
            ],
            QuizStatus.NEW_02,
            'đã tạo mới'
        ))
        List.push(new Action(
            2, [
                QuizStatus.KHOITAO,
                QuizStatus.DRAFT_01
            ],
            QuizStatus.APPROVEREQUEST_04,
            'đã tạo và gửi điều chỉnh'

        ))

        List.push(new Action(
            3, [
                QuizStatus.DRAFT_01,
                QuizStatus.NEW_02,
                QuizStatus.EDIT_03
            ],
            QuizStatus.EDIT_03,
            'đã lưu'
        ))

        List.push(new Action(
            4, [
                QuizStatus.DRAFT_01,
                QuizStatus.NEW_02,
                QuizStatus.EDIT_03
            ],
            QuizStatus.APPROVEREQUEST_04,
            'đã Gửi Duyệt'
        ))

        List.push(new Action(
            5, [
                QuizStatus.APPROVEREJECTED_05
            ],
            QuizStatus.EDIT_03,
            'đã Điều Chỉnh'
        ))

        List.push(new Action(
            61, [
                QuizStatus.APPROVEREQUEST_04
            ],
            QuizStatus.APPROVEREJECTED_05,
            'đã Từ Chối Duyệt'
        ))

        List.push(new Action(
            6, [
                QuizStatus.APPROVEREQUEST_04
            ],
            QuizStatus.MULTIAPPROVED_06,
            'đã Duyệt'
        ))

        List.push(new Action(
            7, [
                QuizStatus.MULTIAPPROVED_06,
            ],
            QuizStatus.MULTIAPPROVED_06,
            'đã Chấm Điểm'
        ))

        List.push(new Action(
            11, [
                QuizStatus.KHOITAO,
                QuizStatus.MULTIAPPROVED_06
            ],
            QuizStatus.APPROVED_011,
            'đã Duyệt cho Báo '
        ))

        List.push(new Action(
            112, [
                QuizStatus.KHOITAO,
                QuizStatus.MULTIAPPROVED_06,
            ],
            QuizStatus.PUBLISHREQUEST_012,
            'đã Duyệt và Gửi Đăng'
        ))

        List.push(new Action(
            12, [
                QuizStatus.APPROVED_011,
                QuizStatus.DIEUCHINHGUIDANG_013,
            ],
            QuizStatus.PUBLISHREQUEST_012,
            'đã Gửi Đăng cho Báo '
        ))

        List.push(new Action(
            13, [
                QuizStatus.PUBLISHREJECTED_0141
            ],
            QuizStatus.DIEUCHINHGUIDANG_013,
            'đã Điều Chỉnh'
        ))

        List.push(new Action(
            141, [
                QuizStatus.PUBLISHREQUEST_012
            ],
            QuizStatus.PUBLISHREJECTED_0141,
            'đã Từ Chối Đăng '
        ))

        List.push(new Action(
            14, [
                QuizStatus.PUBLISHREQUEST_012,
                QuizStatus.UNPUBLISH_016,
                QuizStatus.EDITATPUBLISHED_017
            ],
            QuizStatus.PUBLISHED_014,
            'đã Đăng cho Báo '
        ))

        List.push(new Action(
            15, [
                QuizStatus.PUBLISHED_014
            ],
            QuizStatus.EDITATPUBLISHED_017,
            'đã Điều Chỉnh '
        ))

        List.push(new Action(
            16, [
                QuizStatus.PUBLISHED_014
            ],
            QuizStatus.UNPUBLISH_016,
            'đã Gỡ Đăng '
        ))

        List.push(new Action(
            17, [
                QuizStatus.UNPUBLISH_016
            ],
            QuizStatus.EDITATPUBLISHED_017,
            'đã Điều Chỉnh '
        ))

        List.push(new Action(
            18, [
                QuizStatus.UNPUBLISH_016
            ],
            QuizStatus.PUBLISHREJECTED_0141,
            'đã Trả Về '
        ))

        return List;
    }
}
export class Action {
    actionNum: number;
    listEnableStatus: string[];
    afterStatus: string;
    historyMessage: string;
    constructor(num: number, statuses: string[], afterStatus: string = '', message: string = '') {
        this.actionNum = num;
        this.listEnableStatus = statuses;
        this.afterStatus = afterStatus;
        this.historyMessage = message;
    }
}
