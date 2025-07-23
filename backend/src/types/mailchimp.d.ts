declare module '@mailchimp/mailchimp_marketing' {
  interface Config {
    apiKey: string;
    server: string;
  }

  interface MergeFields {
    FNAME?: string;
    LNAME?: string;
  }

  interface ListMemberRequest {
    email_address: string;
    status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
    merge_fields?: MergeFields;
  }

  interface ListMemberResponse {
    id: string;
    email_address: string;
    status: string;
  }

  interface ListResponse {
    id: string;
    name: string;
    stats: {
      member_count: number;
    };
  }

  interface Lists {
    addListMember(audienceId: string, member: ListMemberRequest): Promise<ListMemberResponse>;
    updateListMember(audienceId: string, subscriberHash: string, member: ListMemberRequest): Promise<ListMemberResponse>;
    getList(audienceId: string): Promise<ListResponse>;
  }

  interface MailchimpMarketing {
    setConfig(config: Config): void;
    lists: Lists;
  }

  const mailchimp: MailchimpMarketing;
  export = mailchimp;
}